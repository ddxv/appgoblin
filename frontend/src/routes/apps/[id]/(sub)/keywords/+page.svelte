<script lang="ts">
	import type { AppFullDetail, KeywordScore } from '../../../../../types';
	import AppKeywordsNav from '$lib/AppKeywordsNav.svelte';

	type KeywordData = {
		keywords: string[];
		keyword_scores: KeywordScore[];
	};

	type KeywordsPageData = {
		myKeywords: KeywordData | string;
		myapp: Promise<AppFullDetail> | AppFullDetail;
		userTrackedKeywordsForApp?: Array<{
			id: number;
			keyword_text: string;
			created_at: string | Date;
		}>;
	};

	let { data }: { data: KeywordsPageData } = $props();

	const isKeywordData = (value: unknown): value is KeywordData => {
		return (
			typeof value === 'object' &&
			value !== null &&
			Array.isArray((value as KeywordData).keyword_scores)
		);
	};

	const toNumber = (value: number | string | null | undefined) => {
		if (value === null || value === undefined) {
			return null;
		}
		if (typeof value === 'number') {
			return Number.isFinite(value) ? value : null;
		}
		const trimmed = value.trim();
		if (trimmed === '' || trimmed.toLowerCase() === 'na') {
			return null;
		}
		const numeric = Number(trimmed);
		return Number.isFinite(numeric) ? numeric : null;
	};

	const average = (values: number[]) => {
		if (!values.length) {
			return null;
		}
		return values.reduce((sum, value) => sum + value, 0) / values.length;
	};

	const formatNumeric = (value: number | null, digits = 1) => {
		if (value === null) {
			return '—';
		}
		return value.toLocaleString(undefined, {
			minimumFractionDigits: digits,
			maximumFractionDigits: digits
		});
	};

	const formatPercent = (value: number | null) => {
		if (value === null) {
			return '—';
		}
		return `${Math.round(value)}%`;
	};

	const formatRank = (value: number | null) => {
		if (value === null) {
			return '—';
		}
		return value.toLocaleString();
	};

	const normalizeKeyword = (value: string) => value.trim().toLowerCase();

	const dedupeByKeywordText = (scores: KeywordScore[]) => {
		const seen = new Set<string>();
		const unique: KeywordScore[] = [];
		for (const score of scores) {
			const key = normalizeKeyword(score.keyword_text);
			if (seen.has(key)) {
				continue;
			}
			seen.add(key);
			unique.push(score);
		}
		return unique;
	};

	const keywordData = $derived(isKeywordData(data.myKeywords) ? data.myKeywords : null);
	const keywordScores = $derived(dedupeByKeywordText(keywordData?.keyword_scores ?? []));
	const rankingKeywords = $derived(
		keywordScores.filter((score) => score.is_keyword_ranking === true)
	);
	const discoveryKeywords = $derived(
		keywordScores.filter(
			(score) => score.is_keyword_ranking !== true && score.is_keyword_generated === true
		)
	);
	const trackedRows = $derived(data.userTrackedKeywordsForApp ?? []);

	const rankedKeywordCount = $derived.by(() => {
		return keywordScores.filter((score) => {
			const latest = toNumber(score.latest_app_rank);
			const best = toNumber(score.d30_best_rank);
			return latest !== null || best !== null;
		}).length;
	});

	const top10Coverage = $derived.by(() => {
		if (rankedKeywordCount <= 0) {
			return null;
		}
		const top10Count = keywordScores.filter((score) => {
			const rank = toNumber(score.latest_app_rank) ?? toNumber(score.d30_best_rank);
			return rank !== null && rank <= 10;
		}).length;
		return (top10Count / rankedKeywordCount) * 100;
	});

	const averageOpportunity = $derived(
		average(
			keywordScores
				.map((score) => toNumber(score.opportunity_score))
				.filter((value): value is number => value !== null)
		)
	);

	const averageDifficulty = $derived(
		average(
			keywordScores
				.map((score) => toNumber(score.keyword_difficulty))
				.filter((value): value is number => value !== null)
		)
	);

	const bestRank = $derived.by(() => {
		const ranks = keywordScores
			.flatMap((score) => [toNumber(score.latest_app_rank), toNumber(score.d30_best_rank)])
			.filter((value): value is number => value !== null);
		if (!ranks.length) {
			return null;
		}
		return Math.min(...ranks);
	});

	const cardBase = 'rounded-xl border border-surface-300-700 bg-surface-100-900 shadow-sm';
	const actionCard = `${cardBase} p-5`;
</script>

{#await data.myapp}
	<div class={`${cardBase} p-6 text-center`}>Loading app details...</div>
{:then myapp}
	<div class="space-y-6">
		<AppKeywordsNav storeId={myapp.store_id} />

		<section class={`${cardBase} p-6`}>
			<h1 class="h4 md:h3">ASO Keywords Overview</h1>
			<p class="mt-2 text-sm text-primary-800-200">
				{myapp.name} has {keywordScores.length.toLocaleString()} unique keywords in this dashboard.
			</p>
		</section>

		<section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
			<div class={cardBase + ' p-4'}>
				<p class="text-xs uppercase tracking-wide text-primary-900-100">Ranking keywords</p>
				<p class="text-3xl font-semibold text-primary-900-100 mt-1">
					{rankingKeywords.length.toLocaleString()}
				</p>
			</div>
			<div class={cardBase + ' p-4'}>
				<p class="text-xs uppercase tracking-wide text-primary-900-100">Discovery keywords</p>
				<p class="text-3xl font-semibold text-primary-900-100 mt-1">
					{discoveryKeywords.length.toLocaleString()}
				</p>
			</div>
			<div class={cardBase + ' p-4'}>
				<p class="text-xs uppercase tracking-wide text-primary-900-100">My tracked keywords</p>
				<p class="text-3xl font-semibold text-primary-900-100 mt-1">
					{trackedRows.length.toLocaleString()}
				</p>
			</div>
			<div class={cardBase + ' p-4'}>
				<p class="text-xs uppercase tracking-wide text-primary-900-100">Top-10 coverage</p>
				<p class="text-3xl font-semibold text-primary-900-100 mt-1">
					{formatPercent(top10Coverage)}
				</p>
			</div>
		</section>

		<section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
			<a class={actionCard} href={`/apps/${myapp.store_id}/keywords/ranking`}>
				<h3 class="h6 md:h5">Ranking View</h3>
				<p class="mt-2 text-sm text-primary-800-200">Monitor app-specific ranking keywords.</p>
			</a>
			<a class={actionCard} href={`/apps/${myapp.store_id}/keywords/discovery`}>
				<h3 class="h6 md:h5">Discovery View</h3>
				<p class="mt-2 text-sm text-primary-800-200">
					Review metadata-derived suggestions and jump to global keyword pages.
				</p>
			</a>
			<a class={actionCard} href={`/apps/${myapp.store_id}/keywords/tracked`}>
				<h3 class="h6 md:h5">My Keywords</h3>
				<p class="mt-2 text-sm text-primary-800-200">
					Manage your personal watchlist for this app.
				</p>
			</a>
			<a class={actionCard} href={`/apps/${myapp.store_id}/keywords/compare`}>
				<h3 class="h6 md:h5">Compare</h3>
				<p class="mt-2 text-sm text-primary-800-200">Compare rank history for selected keywords.</p>
			</a>
		</section>

		<section class={`${cardBase} p-6`}>
			<h2 class="h5 md:h4 mb-3">Snapshot Metrics</h2>
			<div class="grid gap-4 md:grid-cols-3">
				<div>
					<p class="text-xs uppercase tracking-wide text-primary-900-100">Best observed rank</p>
					<p class="text-xl font-semibold text-primary-900-100 mt-1">{formatRank(bestRank)}</p>
				</div>
				<div>
					<p class="text-xs uppercase tracking-wide text-primary-900-100">Average opportunity</p>
					<p class="text-xl font-semibold text-primary-900-100 mt-1">
						{formatNumeric(averageOpportunity, 1)}
					</p>
				</div>
				<div>
					<p class="text-xs uppercase tracking-wide text-primary-900-100">Average difficulty</p>
					<p class="text-xl font-semibold text-primary-900-100 mt-1">
						{formatNumeric(averageDifficulty, 1)}
					</p>
				</div>
			</div>
		</section>
	</div>
{/await}
