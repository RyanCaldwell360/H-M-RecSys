import { getD1 } from "../../../db";

function integer(value: string | null, fallback: number, minimum: number, maximum: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? Math.min(maximum, Math.max(minimum, parsed)) : fallback;
}

function ftsQuery(value: string) {
  const tokens = value.toLowerCase().match(/[\p{L}\p{N}]+/gu)?.slice(0, 6) ?? [];
  return tokens.map((token) => `"${token.replaceAll('"', '""')}"*`).join(" AND ");
}

export async function GET(request: Request) {
  try {
    const database = getD1();
    const url = new URL(request.url);
    const page = integer(url.searchParams.get("page"), 1, 1, 4_398);
    const limit = integer(url.searchParams.get("limit"), 24, 1, 48);
    const query = (url.searchParams.get("q") ?? "").trim().slice(0, 80);
    const productType = (url.searchParams.get("type") ?? "").trim().slice(0, 80);
    const colour = (url.searchParams.get("colour") ?? "").trim().slice(0, 80);
    const imageFilter = url.searchParams.get("hasImage");
    const search = ftsQuery(query);

    const joins = search ? "JOIN articles_fts f ON f.article_id = a.article_id" : "";
    const predicates: string[] = [];
    const bindings: (string | number)[] = [];
    if (search) {
      predicates.push("articles_fts MATCH ?");
      bindings.push(search);
    }
    if (productType) {
      predicates.push("a.product_type = ?");
      bindings.push(productType);
    }
    if (colour) {
      predicates.push("a.colour = ?");
      bindings.push(colour);
    }
    if (imageFilter === "true" || imageFilter === "false") {
      predicates.push("a.has_image = ?");
      bindings.push(imageFilter === "true" ? 1 : 0);
    }
    const where = predicates.length ? `WHERE ${predicates.join(" AND ")}` : "";
    const order = search
      ? "ORDER BY bm25(articles_fts), a.popularity DESC, a.article_id"
      : "ORDER BY a.popularity DESC, a.article_id";
    const offset = (page - 1) * limit;

    const selectSql = `
      SELECT
        a.article_id AS articleId,
        a.name,
        a.product_type AS productType,
        a.product_group AS productGroup,
        a.appearance,
        a.colour,
        a.perceived_colour AS perceivedColour,
        a.department,
        a.index_name AS indexName,
        a.section,
        a.garment_group AS garmentGroup,
        a.description,
        a.image_path AS imagePath,
        a.has_image AS hasImage,
        a.popularity
      FROM articles a
      ${joins}
      ${where}
      ${order}
      LIMIT ? OFFSET ?
    `;
    const countSql = `SELECT COUNT(*) AS total FROM articles a ${joins} ${where}`;
    const [itemsResult, countResult] = await database.batch([
      database.prepare(selectSql).bind(...bindings, limit, offset),
      database.prepare(countSql).bind(...bindings),
    ]);
    const total = Number((countResult.results[0] as { total?: number } | undefined)?.total ?? 0);

    return Response.json(
      {
        items: itemsResult.results,
        pagination: {
          page,
          limit,
          total,
          pages: Math.max(1, Math.ceil(total / limit)),
        },
        query: { q: query, type: productType, colour, hasImage: imageFilter },
      },
      { headers: { "Cache-Control": "public, max-age=30, s-maxage=300" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Catalog query failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
