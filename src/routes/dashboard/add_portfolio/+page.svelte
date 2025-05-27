<script lang="ts">
	import type { PageData } from './$types';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Trash2 } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input/index.js';

	let { data }: { data: PageData } = $props();

	let apiSearch = $state<string>('');
	let title = $state<string>('');
	let apiResults = $state<Stock[]>([]);
	let isLoading = $state<boolean>(false);

	type Stock = {
		symbol: string;
		name: string;
		price: number;
	};

	let selectedStocks = $state<Stock[]>([]);

	function selection(stock: Stock) {
		if (!selectedStocks.find((s) => s.symbol === stock.symbol)) {
			selectedStocks.push(stock);
		}
	}

	function removeSelection(delete_stock: Stock) {
		selectedStocks = selectedStocks.filter((stock) => stock.symbol !== delete_stock.symbol);
	}

	async function createPortfolio() {
		if (!title.trim() || selectedStocks.length === 0) {
			return;
		}
		try {
			const res = await fetch('/api/add_portfolio', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					title,
					stocks: selectedStocks
				})
			});
			const json = await res.json();
			if (!res.ok) {
				console.error('API Error:', json.error);
				return;
			}
		} catch (err) {
			console.error('error: ', err);
		}
	}

	async function fetchStocks(stock: string) {
		if (!stock.trim()) {
			apiResults = [];
			return;
		}

		isLoading = true;
		try {
			const res = await fetch(`/api/stocks?q=${encodeURIComponent(stock)}`);
			const json = await res.json();

			if (!res.ok) {
				console.error('API Error:', json.error);
				apiResults = [];
				return;
			}

			apiResults = json.stocks || [];
		} catch (err) {
			console.error('Error fetching stocks:', err);
			apiResults = [];
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="mt-12 flex flex-col items-center justify-center">
	<div class="w-full max-w-xl rounded-xl border border-neutral-200 bg-white p-8 shadow-lg">
		<Input
			type="text"
			placeholder="title..."
			bind:value={title}
			class="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 text-base focus:border-blue-400 focus:outline-none"
		/>
		<Input
			type="text"
			placeholder="Search stocks via API..."
			bind:value={apiSearch}
			oninput={() => fetchStocks(apiSearch)}
			class="mb-4 w-full rounded-md border border-gray-300 px-4 py-2 text-base focus:border-blue-400 focus:outline-none"
		/>

		{#if isLoading}
			<div class="py-4 text-center text-gray-500">Loading...</div>
		{:else if apiResults.length === 0 && apiSearch.trim() !== ''}
			<div class="py-4 text-center text-gray-500">No stocks found.</div>
		{:else if apiResults.length > 0}
			<div class="max-h-48 overflow-auto">
				{#each apiResults as stock}
					<div
						class="flex cursor-pointer items-center px-4 py-2 transition-colors hover:bg-gray-100 {selectedStocks.find(
							(s) => s.symbol === stock.symbol
						)
							? 'border-l-4 border-blue-400 bg-blue-50'
							: ''}"
						onclick={() => selection(stock)}
					>
						<span class="font-semibold">{stock.symbol}</span>
						<span class="ml-2 text-gray-700">{stock.name}</span>
						<span class="ml-auto text-gray-500">${stock.price}</span>
						{#if selectedStocks.find((s) => s.symbol === stock.symbol)}
							<span class="ml-2 text-sm text-green-600">✓</span>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		{#if selectedStocks.length > 0}
			<hr class="my-6" />
			<h3 class="mb-4 font-semibold text-gray-800">Selected Stocks:</h3>
			<div class="divide-y divide-gray-200">
				{#each selectedStocks as stock}
					<div class="flex w-full items-center justify-between py-3">
						<div class="w-24 font-semibold text-gray-800">{stock.symbol}</div>
						<div class="flex-1 text-gray-700">{stock.name}</div>
						<div class="flex w-32 items-center justify-end gap-3 text-right text-gray-600">
							<span>${stock.price}</span>
							<Button
								variant="ghost"
								size="sm"
								class="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
								onclick={() => removeSelection(stock)}
							>
								<Trash2 size="16"></Trash2>
							</Button>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<div class="mt-6 flex justify-center">
			<Button class="w-32" onclick={createPortfolio} disabled={selectedStocks.length === 0}>
				Confirm ({selectedStocks.length})
			</Button>
		</div>
	</div>
</div>
