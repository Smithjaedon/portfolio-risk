<script lang="ts">
	import Button from './ui/button/button.svelte';
	import Input from './ui/input/input.svelte';
	import Separator from './ui/separator/separator.svelte';
	import financeBlurbUrl from '$lib/images/financeBlurb.svg?url';

	let searchQuery = $bindable('');
</script>

<div class="rounded-md p-6 md:w-1/2">
	<div class="flex justify-center">
		<img src={financeBlurbUrl} alt="financial blurb" class="w-2/3 object-fill" />
	</div>

	<div class="flex flex-col items-center justify-center space-y-6 p-6">
		<Input bind:value={searchQuery} placeholder="search..." class="max-w-1/2" />
		<Button class="w-sm">Create a New Portfolio</Button>
	</div>
	<Separator />
</div>
