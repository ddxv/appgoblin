<script>
	import discordIcon from '$lib/svg/discord-mark-black.svg?raw';
</script>

<svelte:head>
	<!-- Title -->
	<title>About AppGoblin: Open Source App Analytics | Join Our Community</title>

	<!-- Standard meta tags -->
	<meta
		name="description"
		content="Discover AppGoblin: an open source, self-funded app analytics platform. Learn about our mission, join our community on Discord, and contribute on GitHub to shape the future of app market intelligence."
	/>
	<meta
		name="keywords"
		content="AppGoblin, open source, app analytics, self-funded, community-driven, Discord, GitHub, app market intelligence, mobile app insights"
	/>

	<!-- Open Graph meta tags -->
	<meta property="og:title" content="About AppGoblin: Open Source App Analytics Platform" />
	<meta
		property="og:description"
		content="AppGoblin is a self-funded, open source app analytics platform. Join our community on Discord, contribute on GitHub, and help us revolutionize app market intelligence."
	/>
	<meta property="og:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />
	<meta property="og:url" content="https://appgoblin.info/about" />
	<meta property="og:type" content="website" />

	<!-- Twitter Card meta tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta
		name="twitter:title"
		content="About AppGoblin: Open Source App Analytics | Join Our Community"
	/>
	<meta
		name="twitter:description"
		content="Explore AppGoblin: a self-funded, open source platform for app analytics. Learn how you can contribute to our mission of providing app market intelligence."
	/>
	<meta name="twitter:image" content="https://appgoblin.info/goblin_purple_hat_250.png" />

	<!-- Additional meta tags -->
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="https://appgoblin.info/about" />
</svelte:head>

<div class="p-2 px-8 md:px-32 lg:px-72">
	<h1 class="text-3xl font-bold text-primary-900-100">Welcome to AppGoblin</h1>

	<br />

	<div class="card preset-filled-surface-100-900 p-2 md:p-8">
		<h2 class="h2 p-2 md:p-4">Free Community & Feedback</h2>
		<div class="p-4">
			<p>
				Join our Discord community to discuss ASO, app marketing strategies, share AppGoblin product
				ideas, or get feedback.
			</p>

			<br />
			<a
				class="btn preset-tonal"
				href="https://discord.gg/7jpWEhkXRW"
				target="_blank"
				rel="noreferrer"
			>
				<p class="text-base">Join AppGoblin Discord</p>
				<div class="inline-flex items-center">
					{@html discordIcon}
				</div>
			</a>
			<br />
		</div>
	</div>
	<br />
	<div class="card preset-filled-surface-100-900 p-2 md:p-4">
		<h2 class="h2 p-2 md:p-4">Open Source Tech Stack</h2>
		<div class="p-2 md:p-4">
			<p>
				First is the underlying data which is collected and maintained from <strong
					><a href="https://github.com/ddxv/adscrawler">github.com/ddxv/adscrawler</a></strong
				>
				The adscrawler uses Python & PostgreSQL to crawl app stores to collect apps and their basic information
				like names and rating counts. This data is then stored to the PostgreSQL database.
			</p>
			<br />
			<p>
				The website itself is also open source and can be found at
				<strong><a href="https://github.com/ddxv/appgoblin">github.com/ddxv/appgoblin</a></strong> The
				website is built from a Python backend API based on LiteStar which manages queries to the PostgreSQL
				database. The API is used by a JavaScript Svelte frontend with Tailwind and Skeleton for CSS.
				All projects are glued together with systemd and websockets where needed. Everything is hosted
				on AWS in the small EC2 instances.
			</p>
		</div>
		<br />
		<div class="card preset-filled-surface-100-900 p-2 md:p-8">
			<h2 class="h2 p-2 md:p-4">Paid Features</h2>
			<div class="p-4">
				<p>
					AppGoblin provides mostly <strong class="text-primary-900-100"
						>free mobile app marketing resources</strong
					>. The goal is to provide as much free and reproducible open source app analytics for the
					community as possible.
				</p>
				<br />
				<p>
					Some advanced datasets are available for purchase. For example full app-ads.txt data
					(~50GB of data updated daily) is available for $100/month.
				</p>
				<br />
				<p>
					Additional custom reports or analysis are available on request. Please reach out to me
					directly if you'd like to get a quote for a custom report or analysis.
				</p>
			</div>
		</div>

		<br />
		<div class="card preset-filled-surface-100-900 p-2 md:p-8">
			<h2 class="h2 p-2 md:p-4">Background</h2>
			<div class="p-4">
				<p>
					Originally this came out of a curiosity I had about the IAB app-ads.txt standard in 2022.
					In order to scrape app-ads.txt files I had to first get 4,000,000+ iOS and Android apps +
					their respective publisher URLs. While that project, like app-ads.txt itself, went unused,
					I remained interested in letting the database of apps keep growing. Then in the fall of
					2023 while on haitus from real work, I started working on an API and UI.
				</p>
				<br />
				<p>
					Now, App Goblin is the combination of several open source projects I built. Yes, there are
					a large number of similar companies like data.ai and sensortower.com which have many more
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
		<div class="card preset-filled-surface-100-900 p-2 md:p-4">
			<h2 class="h2 p-2 md:p-4">Check the Trackers on Your Android Device</h2>
			<div class="p-2 md:p-4">
				<p>AppGoblin has an Android app which can be used to check the trackers on your device.</p>
				<br />
				<p>You can download it from the Google Play Store.</p>
				<a
					href="https://app.thirdgate.dev/appgoblin-android-site"
					target="_blank"
					class="anchor inline-flex items-baseline"
				>
					<img
						class="w-40 md:w-60"
						src="/gp_en_badge_web_generic.png"
						alt="AppGoblin Android App"
					/>
				</a>
			</div>
		</div>

		<br />
		<p>
			Finally, some of the data is also available for download. The data can be found on
			<strong
				><a href="https://github.com/ddxv/appgoblin-data">github.com/ddxv/appgoblin-data</a></strong
			>. Feelf free to reach out if there are other parts of data you'd like to see exported.
		</p>

		You can also reach me personally:
		<a href="https://jamesoclaire.com">
			<p>https://jamesoclaire.com</p>
		</a>
	</div>
</div>
