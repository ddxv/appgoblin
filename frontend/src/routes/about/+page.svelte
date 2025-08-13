<script>
	import discordIcon from '$lib/svg/discord-mark-black.svg?raw';
	let titlePadding = 'p-2 md:p-4';
	let contentPadding = 'p-2 md:p-4';
	let cardPadding = 'p-2 md:p-4';
	let contentSpacing = 'space-y-4';
	let pricingText = 'mt-2 text-sm opacity-80';
</script>

<svelte:head>
	<!-- Title -->
	<title>About AppGoblin: App Advertising and Marketing Tools</title>

	<!-- Standard meta tags -->
	<meta
		name="description"
		content="Discover AppGoblin: an open source, self-funded app analytics platform. Learn about our mission, join our community on Discord, and contribute on GitHub to shape the future of app market intelligence."
	/>
	<meta
		name="keywords"
		content="AppGoblin, aso, app marekting, competitor analysis, app advertising, in-app advertising, app monetization, open source, app analytics, app market intelligence, mobile app insights, app advertising, app marketing"
	/>

	<!-- Open Graph meta tags -->
	<meta property="og:title" content="About AppGoblin: App Advertising and Marketing Tools" />
	<meta
		property="og:description"
		content="AppGoblin is a free app marketing and advertising analytics platform."
	/>
	<meta property="og:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />
	<meta property="og:url" content="https://appgoblin.info/about" />
	<meta property="og:type" content="website" />

	<!-- Twitter Card meta tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="About AppGoblin: App Marketing and Ad Analytics" />
	<meta
		name="twitter:description"
		content="AppGoblin is a free app marketing and advertising analytics platform."
	/>
	<meta name="twitter:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />

	<!-- Additional meta tags -->
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://appgoblin.info/about" />
</svelte:head>

<div class="p-2 px-8 md:px-32 lg:px-72">
	<h1 class="text-3xl font-bold text-primary-900-100">Welcome to AppGoblin</h1>
	<p>
		AppGoblin has marketing and advertising tools to help illuminate the world of in app advertising
		and marketing. AppGoblin has many <strong class="text-primary-900-100"
			>free mobile app marketing resources</strong
		> as well as some paid datasets like competitor analysis and SDK client lists. The goal is to provide
		as much free and reproducible open source app analytics for the community as possible.
	</p>
	<br />

	<div class="card preset-filled-surface-100-900 p-2 md:p-8">
		<h2 class="h2 p-2 md:p-4">Community & Feedback</h2>
		<div class="p-2 space-y-4">
			<a
				class="btn preset-tonal"
				href="https://discord.gg/7jpWEhkXRW"
				target="_blank"
				rel="noreferrer"
			>
				<div class="inline-flex items-center gap-2">
					{@html discordIcon}
					<p class="text-base">Join AppGoblin Discord</p>
				</div>
			</a>
			<p>
				Join AppGoblin's Discord for a quick way to contact me or discuss ASO, app marketing and in
				app advertisements. Feel free to give feedback or request new features.
			</p>
		</div>
	</div>
	<div class="card preset-filled-surface-100-900 {cardPadding}">
		<h2 class="h2 {titlePadding}">Open Source Resources</h2>
		<div class={contentPadding}>
			<p>
				Some data sets are available for free download. They can be found on
				<strong
					><a href="https://github.com/ddxv/appgoblin-data">github.com/ddxv/appgoblin-data</a
					></strong
				>. Feel free to reach out if there are other parts of data you'd like to see exported.
			</p>
			<br />
			<p>
				The code is maintained open source for transparency. The data is collected with
				<strong><a href="https://github.com/ddxv/adscrawler">github.com/ddxv/adscrawler</a></strong>
				and the website code can be found at
				<strong><a href="https://github.com/ddxv/appgoblin">github.com/ddxv/appgoblin</a></strong>.
			</p>
		</div>
	</div>
	<div class="card preset-filled-surface-100-900 {cardPadding}">
		<h2 class="h2 {titlePadding}">Paid Features</h2>
		<div class={contentPadding}>
			<p>
				AppGoblin is committed to providing open, reproducible mobile app analytics to the
				community. Most of the data and insights on the site are free to access and built on
				open-source pipelines. However, some datasets and services require significant resources to
				maintain and are offered as paid features.
			</p>

			<br />

			<div class="space-y-6 grid grid-cols-1 md:grid-cols-3 gap-4">
				<div class="card preset-filled-surface-50-950 p-4 space-y-2">
					<h4 class="h4 font-semibold text-primary-900-100">Full App-Ads.txt Datasets</h4>
					<p class={pricingText}>$500/month</p>
					<p class="my-2 font-bold">
						Use Cases: Programmatic fraud detection. Ad network analysis. DSP bid enrichment.
					</p>
					<ul class="list-disc list-inside space-y-2">
						<li class="list-disc">Reports updated daily</li>
						<li class="list-disc">Data available as large compressed TSV (~60GB uncompressed)</li>
						<li class="list-disc">Individual ad networks.</li>
						<li class="list-disc">Small customizations available.</li>
					</ul>
					<a
						class="btn preset-outlined-tertiary-500 p-2 md:p-4 mt-4"
						href="mailto:jamesoclaire@gmail.com?subject=Full%20App-Ads.txt%20Datasets"
					>
						<p class="text-center text-sm md:text-base">Get App-Ads.txt Datasets</p>
					</a>
				</div>

				<div class="card preset-filled-surface-50-950 p-4">
					<h4 class="h4 font-semibold text-primary-900-100">Competitor SDK Client List</h4>
					<p class={pricingText}>$500 base + $300 per additional company</p>
					<p class="my-2 font-bold">
						Use Cases: Competitor analysis. Sales prospecting. Market research.
					</p>
					<ul class="list-disc list-inside space-y-2">
						<li class="list-disc">
							All apps using a company or SDK from the top 60k scanned Android and iOS apps.
						</li>
						<li>Publisher Name and Domain</li>
						<li class="list-disc">
							Includes latest app install estimates, category data, and timestamps.
						</li>
						<li class="list-disc">
							Optional Add-Ons: All other SDKs of those apps, app descriptions. Other AppGoblin
							stats available on request.
						</li>
						<li class="list-disc">
							Ongoing reports (e.g., monthly tracking) are available upon request.
						</li>
					</ul>
					<a
						class="btn preset-outlined-tertiary-500 p-2 md:p-4 mt-4"
						href="mailto:jamesoclaire@gmail.com?subject=Competitor%20SDK%20Client%20List"
					>
						<p class="text-center text-sm md:text-base">Get Client List</p>
					</a>
				</div>

				<div class="card preset-filled-surface-50-950 p-4">
					<h4 class="h4 font-semibold text-primary-900-100">Custom Reports, API Integrations</h4>
					<p class={pricingText}>Contact for quote</p>
					<p>
						Need something specific? Custom reports, API integrations, or deeper analytics can be
						arranged. Please reach out with your requirements for a quote.
					</p>
					<a
						class="btn preset-outlined-tertiary-500 p-2 md:p-4 mt-4"
						href="mailto:jamesoclaire@gmail.com?subject=Custom%20Reports%20and%20API%20Integrations"
					>
						<p class="text-center text-sm md:text-base">Contact for Quote</p>
					</a>
				</div>
			</div>

			<br />
			<h3 class="h3 p-2 md:p-4">For Researchers, Journalists, and Academics</h3>
			<div class="card preset-filled-surface-50-950 p-4">
				<p>
					AppGoblin supports independent research and journalism. If you're a student, academic
					researcher, or investigative journalist working on mobile advertising, privacy, or app
					ecosystems, you're welcome to reach out for collaboration.
				</p>
			</div>
		</div>
	</div>

	<br />
	<div class="card preset-filled-surface-100-900 {cardPadding}">
		<h2 class="h2 {titlePadding}">Background</h2>
		<div class={contentPadding}>
			<p>
				Originally this came out of a curiosity I had about the IAB app-ads.txt standard in 2022. In
				order to scrape app-ads.txt files I had to first get 4,000,000+ iOS and Android apps + their
				respective publisher URLs. While that project, like app-ads.txt itself, went unused, I
				remained interested in letting the database of apps keep growing. Then in the fall of 2023
				while on haitus from real work, I started working on an API and UI.
			</p>
			<br />
			<p>
				Now, App Goblin is the combination of several open source projects I built. Yes, there are a
				large number of similar companies like data.ai and sensortower.com which have many more
				features. But it was a great project for me to learn more frontend and javascript.
			</p>
			<br />
			<p>If you have questions or suggestions please feel free to reach out.</p>
			<a href="https://jamesoclaire.com">
				<h2>
					<span>jamesoclaire.com</span>
				</h2>
			</a>
		</div>
	</div>
	<br />
	<div class="card preset-filled-surface-100-900 {cardPadding}">
		<h2 class="h2 {titlePadding}">Check the Trackers on Your Android Device</h2>
		<div class={contentPadding}>
			<p>AppGoblin has an Android app which can be used to check the trackers on your device.</p>
			<br />
			<p>You can download it from the Google Play Store.</p>
			<a
				href="https://app.thirdgate.dev/appgoblin-android-site"
				target="_blank"
				class="anchor inline-flex items-baseline"
			>
				<img class="w-40 md:w-60" src="/gp_en_badge_web_generic.png" alt="AppGoblin Android App" />
			</a>
		</div>
	</div>
</div>
