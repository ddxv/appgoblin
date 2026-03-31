<script>
	import discordIcon from '$lib/svg/discord-mark-black.svg?raw';
	import githubIcon from '$lib/svg/github-mark.svg?raw';

	const channels = [
		{
			icon: null,
			emoji: '✉️',
			label: 'Email',
			description: 'Questions, demos, and general enquiries',
			href: 'mailto:contact@appgoblin.info',
			display: 'contact@appgoblin.info',
			external: false
		},
		{
			icon: 'github',
			emoji: null,
			label: 'GitHub',
			description: 'Report technical issues or request features',
			href: 'https://github.com/appgoblin-dev/appgoblin/issues',
			display: 'github.com/appgoblin-dev/appgoblin',
			external: true
		},
		{
			icon: null,
			emoji: '💼',
			label: 'LinkedIn',
			description: 'Follow for regular updates',
			href: 'https://linkedin.com/company/AppGoblin',
			display: 'linkedin.com/company/AppGoblin',
			external: true
		},
		{
			icon: 'discord',
			emoji: null,
			label: 'Discord',
			description: 'Community discussions, ASO, app marketing and ad tech',
			href: 'https://discord.gg/7jpWEhkXRW',
			display: 'discord.gg/7jpWEhkXRW',
			external: true
		}
	];
</script>

<svelte:head>
	<title>Contact AppGoblin</title>
	<meta
		name="description"
		content="Get in touch with AppGoblin via email, GitHub, LinkedIn, or Discord. Ask questions, report issues, request features, or join the community."
	/>
	<meta property="og:title" content="Contact AppGoblin" />
	<meta property="og:description" content="Reach out via email, GitHub, LinkedIn, or Discord." />
	<meta property="og:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />
	<meta property="og:url" content="https://appgoblin.info/contact" />
	<meta property="og:type" content="website" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://appgoblin.info/contact" />
</svelte:head>

<div class="p-2 px-2 md:px-16 lg:px-32 grid grid-cols-1 gap-6 md:gap-10 max-w-3xl mx-auto">
	<div>
		<h1 class="text-3xl font-bold">Contact</h1>
		<p class="mt-2">Reach out via whichever channel suits you best.</p>
	</div>

	<div class="grid grid-cols-1 gap-4">
		{#each channels as channel}
			<a
				href={channel.href}
				target={channel.external ? '_blank' : undefined}
				rel={channel.external ? 'noreferrer' : undefined}
				class="card preset-filled-surface-100-900 p-4 md:p-6 flex items-start gap-4 hover:preset-filled-surface-200-800 transition-colors"
			>
				<div
					class="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-surface-200-800 text-xl"
				>
					{#if channel.icon === 'github'}
						<span class="w-5 h-5 block [&>svg]:w-full [&>svg]:h-full">{@html githubIcon}</span>
					{:else if channel.icon === 'discord'}
						<span class="w-5 h-5 block [&>svg]:w-full [&>svg]:h-full">{@html discordIcon}</span>
					{:else}
						{channel.emoji}
					{/if}
				</div>
				<div class="min-w-0">
					<p class="font-semibold text-base">{channel.label}</p>
					<p class="text-sm mt-0.5">{channel.description}</p>
					<p class="text-xs text-primary-600-400 mt-1 truncate">{channel.display}</p>
				</div>
				<div class="ml-auto shrink-0 self-center text-surface-400-600">→</div>
			</a>
		{/each}
	</div>
</div>
