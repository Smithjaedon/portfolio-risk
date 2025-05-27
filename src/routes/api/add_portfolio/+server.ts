import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { portfolio } from '$lib/server/db/schema';
import { holding } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit'; // Fix: correct import

export const GET: RequestHandler = async () => {
	return new Response();
};

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const user = locals.user;
		const userid = user?.id;
		if (!userid) {
			return json({ error: 'User not authenticated' }, { status: 401 });
		}
		const { stocks, title } = await request.json();

		const [newPortfolio] = await db
			.insert(portfolio)
			.values({
				userid: userid,
				title: title
			})
			.returning();
		if (stocks && stocks.length > 0) {
			await db.insert(holding).values(
				stocks.map((stock: any) => ({
					...stock,
					portfolioId: newPortfolio.id, // Links each stock to the portfolio
					currentPrice: stock.price || 0
				}))
			);
		}

		return json({ message: 'added new portfolio' });
	} catch (err) {
		console.error(err);
		return json({ error: 'Failed to add portfolio' }, { status: 500 });
	}
};
