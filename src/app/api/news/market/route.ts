import { getMarketNews } from '@/lib/data/news';

export async function GET() {
  try {
    const result = await getMarketNews(8);
    return Response.json(result);
  } catch (error) {
    console.error('[api/news/market]', error);
    return Response.json(
      { error: 'Market news temporarily unavailable' },
      { status: 503 }
    );
  }
}
