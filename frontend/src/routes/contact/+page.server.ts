import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { sendContactEmail } from '$lib/server/contact';

export const load: PageServerLoad = ({ url }) => {
	return { sent: url.searchParams.get('sent') === '1' ? 1 : 0 };
};

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = (data.get('name') as string)?.trim() ?? '';
		const email = (data.get('email') as string)?.trim() ?? '';
		const message = (data.get('message') as string)?.trim() ?? '';

		const errors: Record<string, string> = {};
		if (!name || name.length > 50) errors.name = 'Please enter your name.';
		if (email && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320)) {
			errors.email = 'Please enter a valid email address.';
		}
		if (!message || message.length > 2_500)
			errors.message = 'Please enter a message (max 2,500 characters).';

		if (Object.keys(errors).length > 0) {
			return { status: 'error', errors, values: { name, email, message } };
		}

		try {
			await sendContactEmail(name, email, message);
		} catch {
			return {
				status: 'error',
				errors: { form: 'Failed to send your message. Please try again later.' },
				values: { name, email, message }
			};
		}

		redirect(303, '/contact?sent=1');
	}
} satisfies Actions;
