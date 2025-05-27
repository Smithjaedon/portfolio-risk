import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response();
};

export const POST: RequestHandler = async ({ locals }) => {
	try {
		const currentUser = locals.user;
		if (!currentUser) {
			return new Response('User not authenticated', { status: 401 });
		}
		const userid = currentUser.id;
		await db.insert(user).values({
			id: userid
		});
		return new Response('User signed up successfully', { status: 201 });
	} catch (err) {
		console.error(err);
		return new Response('Failed to sign up', { status: 500 });
	}
};
