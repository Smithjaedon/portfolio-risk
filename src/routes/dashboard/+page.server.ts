import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	if (!locals.session) {
		throw redirect(303, '/login');
	}
}) satisfies PageServerLoad;

export const actions: Actions = {
	signout: async ({ locals: { supabase } }) => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			return { error: error.message };
		}

		throw redirect(303, '/login');
	}
};
