<script lang="ts">
	let { sectionId }: { sectionId: string } = $props();

	const headingClass = 'text-2xl font-bold md:text-3xl';
	const paragraphClass = 'max-w-3xl';
	const companyLinkClass = 'font-semibold text-primary-700 hover:underline dark:text-primary-300';
</script>

{#if sectionId === 'qoq-share-change-ad-networks'}
	<h2 class={headingClass}>Fastest growing mobile Ad Networks by SDKs detected</h2>
	<p class={paragraphClass}>
		<a href="/companies/monetrix.ai" class={companyLinkClass}>Monetrix.ai</a> topped the 2026 Q2 growth
		for Google Play with a huge 200% increase detected by AppGoblin. This large percentage increase is
		partially influenced by Monetrix's smaller app footprint but shows strong growth on Android.
	</p>
	<p class={paragraphClass}>
		<a href="/companies/display.io" class={companyLinkClass}>Display.io</a> saw huge growth that also
		showed up in App-Ads.txt files as well. With HQ in New York, Display.io is showing amazing growth
		in their mobile game integrations across a variety of geos.
	</p>
	<p class={paragraphClass}>
		More of a European wave? <a href="/companies/applike-group.com" class={companyLinkClass}
			>AppLike</a
		>, which also owns <a href="/companies/adjoe.io" class={companyLinkClass}>AdJoe</a> and
		<a href="/companies/justtrack.io" class={companyLinkClass}>JustTrack</a> and is based in Berlin, Germany,
		just keeps smashing with continued growth.
	</p>
	<p class={paragraphClass}>
		Hard not to mention <a href="/companies/moloco.com" class={companyLinkClass}>Moloco</a> here, which,
		though it saw a smaller percentage than the smaller SDK Ad Networks, is nonetheless absolutely dominating
		with over 6k apps detected with its SDK in Q2 2026 and is reflected in its programmatic growth in
		App-Ads.txt as well.
	</p>
{:else if sectionId === 'qoq-share-change-programmatic-ad-networks'}
	<h2 class={headingClass}>Fastest growing mobile Ad Networks by App-Ads.txt</h2>
	<p class={paragraphClass}>
		<a href="/companies/yango-ads.com" class={companyLinkClass}>Yango Ads</a> is a new programmatic
		ad network from <a href="/companies/yandex.com" class={companyLinkClass}>Yandex</a> that has been
		growing quickly. Yandex is of course already a huge presence in mobile app ads, so it's no surprise
		they can push their newest ad network adoption.
	</p>
	<p class={paragraphClass}>
		<a href="/companies/cas.ai" class={companyLinkClass}>Cas.ai</a>, previously Clever Ad Solutions,
		showed strong double-digit growth in app-ads.txt listings across iOS and Android, hitting nearly
		10k iOS apps with app-ads.txt linking back to Cas.ai.
	</p>
{:else if sectionId === 'qoq-share-change-analytics'}
	<h2 class={headingClass}>Fastest growing mobile Analytics</h2>
	<div class="max-w-3xl space-y-3">
		<p>
			<a href="/companies/singular.net" class={companyLinkClass}>Singular</a> showed a significant increase,
			surpassing 2k Android apps detected using the Singular SDKs for a solid 6% quarterly growth in its
			analytics business.
		</p>
		<p>
			<a href="/companies/tenjin.com" class={companyLinkClass}>Tenjin</a>, again (it was on
			AppGoblin's Q1 report as well), showed solid growth.
		</p>
	</div>
{:else if sectionId === 'qoq-share-change-business-tools'}
	<h2 class={headingClass}>Fastest growing mobile Business Tools</h2>
	<p class={paragraphClass}>
		<a href="/companies/integralads.com" class={companyLinkClass}>Integral Ad Science</a> showed healthy
		Android growth with nearly 10% growth fueled by more apps making API calls to their backend. It's
		worth noting here that the number of Apps reported that use their SDK is much less than the number
		seen calling out to their API backend.
	</p>
	<p class={paragraphClass}>
		For iOS we saw surprisingly high growth in the number of iOS apps that are using
		<a href="/companies/razorpay.com" class={companyLinkClass}>Razorpay</a>. RazorPay is a hugely
		popular payment processor in India, so it could be that this is more reflective of an increase
		in the types of iOS apps we scanned in Q2.
	</p>
{:else if sectionId === 'qoq-share-change-development-tools'}
	<h2 class={headingClass}>Fastest growing mobile Development Tools</h2>
	<p class={paragraphClass}>
		For development tools, it is no surprise that we continue to see the growth of
		<a href="/companies/divkit.tech" class={companyLinkClass}>DivKit</a> and
		<a href="/companies/expo.dev" class={companyLinkClass}>Expo</a>. React Native also continues to
		be an important part of the mobile development ecosystem.
	</p>
{:else if sectionId === 'apps-lost'}
	<h2 class={headingClass}>Apps lost</h2>
	<p class={paragraphClass}>
		These are the companies that saw the most apps leave their platforms. Many of these companies
		still saw growth; they also churned some client apps at the same time.
	</p>
	<p class={paragraphClass}>
		The full list of the apps they added and lost in the past quarter are available on their
		respective AppGoblin company pages.
	</p>
{/if}
