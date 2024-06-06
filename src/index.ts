import { EmailMessage } from 'cloudflare:email';
import { createMimeMessage } from 'mimetext';

export interface Env {
	SEB: any;
	SENDER: string;
	RECIPIENT: string;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (request.method === 'POST') {
			const formData = await request.formData();
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
