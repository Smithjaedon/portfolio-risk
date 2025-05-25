import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response();
};

export const POST: RequestHandler = async ({ locals: { supabase } }) => {
	const { error } = await supabase.auth.signOut();

	if (error) {
		return new Response(error.message, { status: 500 });
	}

	return new Response(null, { status: 200 });
};
