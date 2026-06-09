import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import type { CatData } from '../../types';

const configuredPath = process.env.APP_CATEGORIES_PATH;

const candidatePaths = [
	configuredPath,
	resolve(process.cwd(), 'static', 'appCategories.json'),
	resolve(process.cwd(), 'frontend', 'static', 'appCategories.json'),
	resolve(process.cwd(), 'build_tmp', 'client', 'appCategories.json'),
	resolve(process.cwd(), 'build', 'client', 'appCategories.json'),
	resolve(process.cwd(), 'client', 'appCategories.json')
].filter((path): path is string => Boolean(path));

let appCategoriesPromise: Promise<CatData> | null = null;

function assertCatData(value: unknown): asserts value is CatData {
	if (
		typeof value !== 'object' ||
		value === null ||
		!('categories' in value) ||
		!Array.isArray(value.categories)
	) {
		throw new Error('appCategories.json must contain a { categories: [] } object');
	}
	for (const category of value.categories) {
		if (
			typeof category !== 'object' ||
			category === null ||
			typeof category.id !== 'string' ||
			typeof category.name !== 'string' ||
			typeof category.android !== 'boolean' ||
			typeof category.ios !== 'boolean'
		) {
			throw new Error('appCategories.json contains an invalid category record');
		}
	}
}

async function readAppCategoriesFile(): Promise<CatData> {
	let lastError: unknown;

	for (const filePath of candidatePaths) {
		try {
			const raw = await readFile(filePath, 'utf-8');
			const parsed: unknown = JSON.parse(raw);
			assertCatData(parsed);
			console.log(`[Cache] Loaded app categories from ${filePath}`);
			return parsed;
		} catch (error) {
			lastError = error;
		}
	}

	throw new Error(
		`Unable to load appCategories.json from any known path: ${candidatePaths.join(', ')}`,
		{ cause: lastError instanceof Error ? lastError : undefined }
	);
}

export function getAppCategories(): Promise<CatData> {
	if (appCategoriesPromise === null) {
		appCategoriesPromise = readAppCategoriesFile();
	}

	return appCategoriesPromise;
}
