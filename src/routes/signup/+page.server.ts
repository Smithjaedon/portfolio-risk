import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { redirect } from '@sveltejs/kit';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions = {
	signup: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await locals.supabase.auth.signUp({
			email,
			password
		});

		if (error) {
			return { error: error.message };
		}
		try {
      const currUser = locals.user;
      if (!currUser) {
        throw new Error('User not authenticated');
      }
      const i = currUser.id;
      await db.insert(user).values({
        id: i
      });
		} catch (err) {
			console.error('Error during signup:', err);
		}
		throw redirect(303, '/login');
	}
};
