import nodemailer from 'nodemailer';
import { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASSWORD } from '$env/static/private';

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
	if (transporter) return transporter;

	if (!EMAIL_PASSWORD) {
		if (import.meta.env.DEV) {
			console.warn('EMAIL_PASSWORD not set — contact emails will be logged to console');
			return null;
		}
		throw new Error('EMAIL_PASSWORD environment variable is required in production');
	}

	transporter = nodemailer.createTransport({
		host: EMAIL_HOST,
		port: parseInt(EMAIL_PORT),
		secure: true,
		auth: {
			user: EMAIL_USER,
			pass: EMAIL_PASSWORD
		}
	});

	return transporter;
}

export async function sendContactEmail(
	name: string,
	email: string,
	message: string
): Promise<void> {
	const t = getTransporter();

	const emailLine = email ? `Email: ${email}` : 'No email provided';
	const textBody = `New contact form submission\n\nName: ${name}\n${emailLine}\nMessage:\n${message}`;
	const emailHtml = email
		? `<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>`
		: '<p><em>No email provided</em></p>';
	const htmlBody = `
		<div>
			<h2>New contact form submission</h2>
			<p><strong>Name:</strong> ${name}</p>
			${emailHtml}
			<p><strong>Message:</strong></p>
			<blockquote>${message}</blockquote>
		</div>
	`;

	if (!t) {
		console.log(`[DEV] Contact form: ${name}${email ? ` <${email}>` : ' (no email)'}`);
		console.log(`[DEV] Message: ${message}`);
		return;
	}

	const mailOptions: Record<string, unknown> = {
		from: `"AppGoblin Contact" <${EMAIL_USER}>`,
		to: EMAIL_USER,
		subject: `Contact form: ${name}`,
		text: textBody,
		html: htmlBody
	};
	if (email) {
		mailOptions.replyTo = email;
	}

	await t.sendMail(mailOptions);
}
