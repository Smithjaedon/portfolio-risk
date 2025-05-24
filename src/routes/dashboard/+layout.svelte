<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import * as Menubar from '$lib/components/ui/menubar/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Settings } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	async function signout() {
		try {
			const { error } = await data.supabase.auth.signOut();
			if (error) throw error;
			goto('/login');
		} catch (error) {
			console.error('Error signing out:', error);
		}
	}
</script>

<div class="grid grid-rows-[auto_auto]">
	<Menubar.Root class="w-full">
		<div class="flex w-full items-center justify-between p-3">
			<div class="">
				<h1 class="text-xl font-medium tracking-tight">Portfolio Risk</h1>
			</div>
			<div>
				<Menubar.Menu>
					<Menubar.Trigger><Settings /></Menubar.Trigger>
					<Menubar.Content>
						<form action="signout" method="POST" id="signout">
							<Menubar.Item
								><Button type="submit" variant="ghost" class="h-5" form="signout" onclick={signout}
									>Signout</Button
								></Menubar.Item
							>
						</form>
					</Menubar.Content>
				</Menubar.Menu>
			</div>
		</div>
	</Menubar.Root>
	{@render children()}
</div>
