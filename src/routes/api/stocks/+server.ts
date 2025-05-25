import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    const query = url.searchParams.get('q');

    if (!query) {
        return json({ error: 'Query parameter is required' }, { status: 400 });
    }

    try {
        const response = await fetch(`http://localhost:8000/stocks/${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        return json({
            stocks: Array.isArray(data) ? data : (data.stocks || [])
        });

    } catch (error) {
        console.error('Error fetching stocks:', error);
        return json({ error: 'Failed to fetch stock data', stocks: [] }, { status: 500 });
    }
};
