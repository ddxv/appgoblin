import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

const config = {
	darkMode: 'selector',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [forms]
} satisfies Config;

export default config;
