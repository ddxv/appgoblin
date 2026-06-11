<script>
	const channels = [
		{
			label: 'Email',
			description: 'Questions, demos, and general enquiries',
			href: 'mailto:contact@appgoblin.info',
			url: 'contact@appgoblin.info'
		},
		{
			label: 'GitHub',
			description: 'Report technical issues or request features',
			href: 'https://github.com/appgoblin-dev/appgoblin',
			url: 'https://github.com/appgoblin-dev/appgoblin'
		},
		{
			label: 'LinkedIn',
			description: 'Follow for regular updates',
			href: 'https://linkedin.com/company/AppGoblin',
			url: 'https://linkedin.com/company/AppGoblin'
		},
		{
			label: 'Discord',
			description: 'Community discussions, ASO, app marketing and ad tech',
			href: 'https://discord.gg/7jpWEhkXRW',
			url: 'https://discord.gg/7jpWEhkXRW'
		}
	];

	import { enhance } from '$app/forms';

	let { form, data } = $props();

	let showSent = $derived(data.sent === 1);
</script>

<svelte:head>
	<title>Contact AppGoblin</title>
	<meta
		name="description"
		content="Get in touch with AppGoblin via email, GitHub, LinkedIn, or Discord, or use the contact form. Ask questions, report issues, request features, or join the community."
	/>
	<meta property="og:title" content="Contact AppGoblin" />
	<meta
		property="og:description"
		content="Reach out via email, GitHub, LinkedIn, Discord, or the contact form."
	/>
	<meta property="og:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />
	<meta property="og:url" content="https://appgoblin.info/contact" />
	<meta property="og:type" content="website" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://appgoblin.info/contact" />
</svelte:head>

<div class="mx-auto max-w-2xl px-4 py-6">
	<h1 class="text-3xl font-bold">Contact</h1>
	<p class="mt-3">Reach out through any channel you prefer.</p>

	<div class="mt-6 space-y-5">
		{#each channels as channel}
			<p>
				<strong>{channel.label}:</strong>
				{channel.description}<br />
				<a
					href={channel.href}
					target={channel.href.startsWith('http') ? '_blank' : undefined}
					rel={channel.href.startsWith('http') ? 'noreferrer' : undefined}
					class="underline break-all"
				>
					{channel.url}
				</a>
			</p>
		{/each}
	</div>

	<hr class="my-8 border-surface-300" />

	<h2 class="text-2xl font-bold">Send a message</h2>
	<p class="mt-2">Use the form below for inquiries, questions, or tips.</p>

	<form method="POST" use:enhance class="mt-6 space-y-5">
		{#if showSent}
			<div
				class="rounded-lg border border-success-500 bg-success-50 p-4 text-success-700"
				role="alert"
			>
				<p class="font-medium">Message sent!</p>
				<p class="mt-1 text-sm">Thank you for reaching out. We'll get back to you soon.</p>
			</div>
		{/if}

		{#if form?.status === 'error' && form.errors?.form}
			<div class="rounded-lg border border-error-500 bg-error-50 p-4 text-error-700" role="alert">
				<p class="font-medium">Something went wrong</p>
				<p class="mt-1 text-sm">{form.errors.form}</p>
			</div>
		{/if}

		<div>
			<label for="name" class="block text-sm font-medium">Name</label>
			<input
				id="name"
				name="name"
				type="text"
				required
				maxlength="50"
				value={form?.status === 'error' ? (form.values?.name ?? '') : ''}
				class="mt-1 block w-full rounded-md border border-surface-300 bg-surface-50 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
				placeholder="Your name"
			/>
			{#if form?.status === 'error' && form.errors?.name}
				<p class="mt-1 text-sm text-error-500">{form.errors.name}</p>
			{/if}
		</div>

		<div>
			<label for="email" class="block text-sm font-medium"
				>Email <span class="text-surface-400 font-normal">(optional — needed for a reply)</span
				></label
			>
			<input
				id="email"
				name="email"
				type="email"
				value={form?.status === 'error' ? (form.values?.email ?? '') : ''}
				class="mt-1 block w-full rounded-md border border-surface-300 bg-surface-50 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
				placeholder="you@example.com"
			/>
			{#if form?.status === 'error' && form.errors?.email}
				<p class="mt-1 text-sm text-error-500">{form.errors.email}</p>
			{/if}
		</div>

		<div>
			<label for="message" class="block text-sm font-medium">Message</label>
			<textarea
				id="message"
				name="message"
				rows="5"
				required
				maxlength="2500"
				class="mt-1 block w-full rounded-md border border-surface-300 bg-surface-50 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500"
				placeholder="Your message..."
				>{form?.status === 'error' ? (form.values?.message ?? '') : ''}</textarea
			>
			{#if form?.status === 'error' && form.errors?.message}
				<p class="mt-1 text-sm text-error-500">{form.errors.message}</p>
			{/if}
		</div>

		<button
			type="submit"
			class="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
		>
			Send message
		</button>
	</form>
</div>
