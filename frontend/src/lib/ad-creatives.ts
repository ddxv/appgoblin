export const adCreativeCategories = [
    { value: 'overall', label: 'Overall (All Apps)' },
    { value: 'game%', label: 'All Games' },
    { value: 'game_action', label: 'Game: Action' },
    { value: 'game_puzzle', label: 'Game: Puzzle' },
    { value: 'game_strategy', label: 'Game: Strategy' },
    { value: 'game_simulation', label: 'Game: Simulation' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'finance', label: 'Finance' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'social', label: 'Social' }
] as const;

export const adCreativeFormats = [
    { value: 'all', label: 'All Formats' },
    { value: 'video', label: 'Videos (MP4, WebM)' },
    { value: 'image', label: 'Images (JPG, PNG)' },
    { value: 'html', label: 'Interactive (HTML)' }
] as const;

export function normalizeAdCreativeCategory(category?: string | null): string | null {
    const normalized = category?.trim();
    if (!normalized || normalized === 'overall') {
        return null;
    }

    return normalized;
}

export function normalizeAdCreativeFormat(format?: string | null): string | null {
    const normalized = format?.trim();
    if (!normalized || normalized === 'all') {
        return null;
    }

    return normalized;
}

export function normalizeAdCreativeNetwork(network?: string | null): string | null {
    const normalized = network?.trim();
    if (!normalized) {
        return null;
    }

    return normalized;
}

export function getAdCreativeCategoryLabel(category?: string | null): string {
    if (!category || category === 'overall') {
        return 'All Apps';
    }

    return (
        adCreativeCategories.find((item) => item.value === category)?.label ?? humanizeFilterLabel(category)
    );
}

export function getAdCreativeNetworkLabel(network?: string | null): string {
    if (!network) {
        return 'All Networks';
    }

    return humanizeFilterLabel(network);
}

export function buildAdCreativesPath({
    category,
    network
}: {
    category?: string | null;
    network?: string | null;
}): string {
    const normalizedCategory = normalizeAdCreativeCategory(category);
    const normalizedNetwork = normalizeAdCreativeNetwork(network);

    if (normalizedNetwork) {
        return `/ad-creatives/network/${encodeURIComponent(normalizedNetwork)}`;
    }

    if (normalizedCategory) {
        return `/ad-creatives/app-category/${encodeURIComponent(normalizedCategory)}`;
    }

    return '/ad-creatives';
}

export function buildAdCreativesUrl({
    category,
    format,
    network
}: {
    category?: string | null;
    format?: string | null;
    network?: string | null;
}): string {
    const normalizedCategory = normalizeAdCreativeCategory(category);
    const normalizedFormat = normalizeAdCreativeFormat(format);
    const normalizedNetwork = normalizeAdCreativeNetwork(network);
    const path = buildAdCreativesPath({ category: normalizedCategory, network: normalizedNetwork });
    const params = new URLSearchParams();

    if (normalizedFormat) {
        params.set('format', normalizedFormat);
    }

    if (path.startsWith('/ad-creatives/network/')) {
        if (normalizedCategory) {
            params.set('category', normalizedCategory);
        }
    } else if (path.startsWith('/ad-creatives/app-category/')) {
        if (normalizedNetwork) {
            params.set('company', normalizedNetwork);
        }
    } else {
        if (normalizedCategory) {
            params.set('category', normalizedCategory);
        }

        if (normalizedNetwork) {
            params.set('company', normalizedNetwork);
        }
    }

    const queryString = params.toString();
    return queryString ? `${path}?${queryString}` : path;
}

function humanizeFilterLabel(value: string): string {
    return decodeURIComponent(value)
        .split(/[_-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}