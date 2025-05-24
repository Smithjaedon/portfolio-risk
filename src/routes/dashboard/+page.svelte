<script lang="ts">
	import type { PageData } from './$types';
	import PortGrid from '$lib/components/port-grid.svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="flex flex-col items-center justify-center space-y-6 p-4">
	<PortGrid />
</div>
