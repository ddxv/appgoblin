import { writable } from 'svelte/store';
import type { Categories } from './types';

export const myCollectionStore = writable('new_weekly');
export const myStoreSelection = writable('google');
export const myCategorySelection = writable('overall');

export const myCategoryMap = writable<Categories>({ mycats: { categories: {} } });
