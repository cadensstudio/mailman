import { EmailMessage } from 'cloudflare:email';
import { createMimeMessage } from 'mimetext';

export interface Env {
	SEB: any;
	SENDER: string;
	RECIPIENT: string;
	TURNSTILE_SECRET_KEY: string;
}

async function validateTurnstileToken(token: string, ip: string | null, secretKey: string): Promise<boolean> {
	const formData = new FormData();
	formData.append('secret', secretKey);
	formData.append('response', token);
	if (ip) {
		formData.append('remoteip', ip);
	}

	const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		body: formData,
	});
	const result: any = await response.json();
	console.log({ message: 'performing turnstile siteverify', result: result });
	return result.success;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (request.method === 'POST') {
			const formData = await request.formData();
			const entries = Object.fromEntries(formData.entries());

			// Validate Turnstile token
			const token = formData.get('cf-turnstile-response');
			const ip = request.headers.get('CF-Connecting-IP');
			const isValidTurnstile = await validateTurnstileToken(token as string, ip, env.TURNSTILE_SECRET_KEY);
			if (!isValidTurnstile) {
				console.log({ status: 'message blocked due to failed turnstile challenge', form_data: entries });
				return new Response('Unauthorized request', { status: 403 });
			}

			const firstName = formData.get('firstName') as string;
			const lastName = formData.get('lastName') as string;
			const email = formData.get('email') as string;
			const message = formData.get('message') as string;

			const msg = createMimeMessage();
			msg.setSender({ name: 'Website Bot', addr: env.SENDER });
			msg.setRecipient(env.RECIPIENT);
			msg.setSubject('New Contact Form Submission');
			msg.addMessage({
				contentType: 'text/plain',
				data: `Name: ${firstName} ${lastName}\nEmail: ${email}\nMessage: ${message}`,
			});

			const emailMessage = new EmailMessage(env.SENDER, env.RECIPIENT, msg.asRaw());

			try {
				await env.SEB.send(emailMessage);
				return new Response('Email sent successfully!', { status: 200 });
			} catch (e) {
				if (e instanceof Error) {
					return new Response(`Failed to send email: ${e.message}`, { status: 500 });
				} else {
					return new Response('An unknown error occurred', { status: 500 });
				}
			}
		} else {
			return new Response('Method not allowed', { status: 405 });
		}
	},
};
