import { getD1 } from "../../../../db";

type ArticleRow = {
  articleId: string;
  name: string;
  productType: string;
  colour: string;
  indexName: string;
  section: string;
  garmentGroup: string;
  description: string | null;
  imagePath: string | null;
  popularity: number;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ rank: string }> },
) {
  try {
    const { rank: rankValue } = await params;
    const rank = Number.parseInt(rankValue, 10);
    if (!Number.isInteger(rank) || rank < 1 || rank > 1_000) {
      return Response.json({ error: "Customer rank must be between 1 and 1000" }, { status: 400 });
    }

    const database = getD1();
    const customerResult = await database.prepare(`
      SELECT customer_id AS customerId, cohort_rank AS rank, label,
        history_count AS historyCount, first_purchase_at AS firstPurchaseAt,
        last_purchase_at AS lastPurchaseAt
      FROM customers WHERE cohort_rank = ?
    `).bind(rank).first<{
      customerId: string;
      rank: number;
      label: string;
      historyCount: number;
      firstPurchaseAt: string;
      lastPurchaseAt: string;
    }>();
    if (!customerResult) return Response.json({ error: "Customer not found" }, { status: 404 });

    const historyResult = await database.prepare(`
      SELECT
        t.purchased_at AS purchasedAt,
        t.price,
        a.article_id AS articleId,
        a.name,
        a.product_type AS productType,
        a.colour,
        a.index_name AS indexName,
        a.section,
        a.garment_group AS garmentGroup,
        a.description,
        a.image_path AS imagePath,
        a.popularity
      FROM transactions t
      JOIN articles a ON a.article_id = t.article_id
      WHERE t.customer_id = ?
      ORDER BY t.purchased_at DESC, t.id DESC
    `).bind(customerResult.customerId).all<ArticleRow & { purchasedAt: string; price: number }>();
    const history = historyResult.results;
    const purchasedIds = new Set(history.map((item) => item.articleId));
    const candidatesResult = await database.prepare(`
      SELECT
        article_id AS articleId, name, product_type AS productType, colour,
        index_name AS indexName, section, garment_group AS garmentGroup,
        description, image_path AS imagePath, popularity
      FROM articles
      WHERE has_image = 1
      ORDER BY popularity DESC, article_id
    `).all<ArticleRow>();

    const categoryCounts = new Map<string, number>();
    const colourCounts = new Map<string, number>();
    const indexCounts = new Map<string, number>();
    for (const item of history) {
      categoryCounts.set(item.productType, (categoryCounts.get(item.productType) ?? 0) + 1);
      colourCounts.set(item.colour, (colourCounts.get(item.colour) ?? 0) + 1);
      indexCounts.set(item.indexName, (indexCounts.get(item.indexName) ?? 0) + 1);
    }
    const maxPopularity = Math.max(...candidatesResult.results.map((item) => item.popularity), 1);
    const recommendations = candidatesResult.results
      .filter((item) => !purchasedIds.has(item.articleId))
      .map((item) => {
        const categoryAffinity = (categoryCounts.get(item.productType) ?? 0) / history.length;
        const colourAffinity = (colourCounts.get(item.colour) ?? 0) / history.length;
        const indexAffinity = (indexCounts.get(item.indexName) ?? 0) / history.length;
        const score = (item.popularity / maxPopularity) * 0.35
          + categoryAffinity * 0.3
          + colourAffinity * 0.2
          + indexAffinity * 0.1
          + 0.05;
        const reason = categoryAffinity && colourAffinity
          ? `${item.colour} ${item.productType.toLowerCase()} matches this history`
          : categoryAffinity
            ? `More ${item.garmentGroup.toLowerCase()}`
            : colourAffinity
              ? `Matches a ${item.colour.toLowerCase()} preference`
              : "Popular in the sample window";
        return { ...item, score: Number(score.toFixed(4)), reason };
      })
      .sort((left, right) => right.score - left.score || right.popularity - left.popularity)
      .slice(0, 8);

    return Response.json({
      customer: {
        rank: customerResult.rank,
        label: customerResult.label,
        historyCount: customerResult.historyCount,
        firstPurchaseAt: customerResult.firstPurchaseAt,
        lastPurchaseAt: customerResult.lastPurchaseAt,
      },
      history,
      recommendations,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Customer history query failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
