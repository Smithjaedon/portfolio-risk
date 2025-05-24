import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const query = url.searchParams.get('q');

	if (!query) {
		return json({ error: 'Query parameter is required' }, { status: 400 });
	}

	try {
		const response = await fetch(`https://query1.finance.yahoo.com/v1/finance/search?q=${query}`, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();

		const stocks =
			data.quotes?.map((quote: any) => ({
				symbol: quote.symbol,
				name: quote.shortname || quote.longname || 'N/A',
				price: quote.regularMarketPrice || 0,
				exchange: quote.exchange
			})) || [];

		return json({ stocks });
	} catch (error) {
		console.error('Error fetching stocks:', error);
		return json({ error: 'Failed to fetch stock data' }, { status: 500 });
	}
};