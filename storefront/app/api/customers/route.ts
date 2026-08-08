import { getD1 } from "../../../db";

export async function GET(request: Request) {
  try {
    const database = getD1();
    const url = new URL(request.url);
    const page = Math.max(1, Number.parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, Number.parseInt(url.searchParams.get("limit") ?? "25", 10) || 25));
    const offset = (page - 1) * limit;
    const [customers, count] = await database.batch([
      database.prepare(`
        SELECT cohort_rank AS rank, label, history_count AS historyCount,
          first_purchase_at AS firstPurchaseAt, last_purchase_at AS lastPurchaseAt
        FROM customers
        ORDER BY cohort_rank
        LIMIT ? OFFSET ?
      `).bind(limit, offset),
      database.prepare("SELECT COUNT(*) AS total FROM customers"),
    ]);
    return Response.json({
      customers: customers.results,
      pagination: {
        page,
        limit,
        total: Number((count.results[0] as { total?: number } | undefined)?.total ?? 0),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Customer query failed";
    return Response.json({ error: message }, { status: 500 });
  }
}
