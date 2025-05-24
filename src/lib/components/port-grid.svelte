<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge';
	import Button from './ui/button/button.svelte';
	import Input from './ui/input/input.svelte';
	import Separator from './ui/separator/separator.svelte';
	import financeBlurbUrl from '$lib/images/financeBlurb.svg?url';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Command from '$lib/components/ui/command';

	type Portfolio = {
		name: string;
		isPositive: boolean;
		percentageReturn: number;
		value: number;
		lastUpdated: string;
	};

	let searchQuery = $state<string>('');

	const ports: Portfolio[] = [
		{
			name: 'Growth Fund',
			isPositive: true,
			percentageReturn: 15.42,
			value: 150000,
			lastUpdated: '2025-05-23'
		},
		{
			name: 'Income Portfolio',
			isPositive: false,
			percentageReturn: -3.87,
			value: 98000,
			lastUpdated: '2025-05-23'
		},
		{
			name: 'Tech Stocks',
			isPositive: true,
			percentageReturn: 23.65,
			value: 210000,
			lastUpdated: '2025-05-23'
		},
		{
			name: 'Emerging Markets',
			isPositive: false,
			percentageReturn: -8.14,
			value: 67000,
			lastUpdated: '2025-05-23'
		}
	];
	let filterPorts = $derived(
		searchQuery.trim() === ''
			? ports
			: ports.filter((port) => port.name.toLowerCase().includes(searchQuery.toLowerCase()))
	);
</script>

<div class="rounded-md p-6 md:w-1/2">
	<div class="flex justify-center">
		<img src={financeBlurbUrl} alt="financial blurb" class="w-2/3 object-fill" />
	</div>

	<div class="flex flex-col items-center justify-center space-y-6 p-6">
		<Input bind:value={searchQuery} placeholder="search..." class="max-w-1/2" />
		<Button class="w-sm" href="/dashboard/add_portfolio">Create a New Portfolio</Button>
	</div>
	<Separator />
</div>
<div class="w-2/3">
	{#if ports}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each filterPorts as port}
				<Card.Root
					class="w-full cursor-pointer transition-all duration-300 ease-in-out hover:border-neutral-600 hover:shadow-lg"
				>
					<Card.Header>
						<Card.Title>
							<div class="flex items-center justify-between">
								{port.name}
								<Badge
									class="{port.isPositive
										? 'bg-green-500'
										: 'bg-red-500'} transition-colors duration-200"
								>
									{port.percentageReturn > 0 ? '+' : ''}{port.percentageReturn}%
								</Badge>
							</div>
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="space-y-2">
							<p class="text-2xl font-bold transition-colors duration-200">
								${port.value.toLocaleString()}
							</p>
							<p class="text-muted-foreground text-sm">Last updated: {port.lastUpdated}</p>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	{/if}
</div>
