# Mailman

Mailman is a project that sends contact form data in an email to a specified recipient using [Cloudflare Workers and Cloudflare Email Routing](https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/). It also includes spam protection using [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/tutorials/implicit-vs-explicit-rendering/) to ensure only legitimate submissions are processed.

## Prerequisites

- Cloudflare account with Email Routing enabled.
- Verified email addresses in Cloudflare Email Routing.
- A sitekey and secret key. You can obtain the sitekey and secret key from the Cloudflare dashboard after adding your zone to Turnstile.

## Project Features

1. **Send Contact Form Entries**: Mailman sends contact form data directly to an email address using Cloudflare's Email Worker API.
2. **Spam Protection**: Integration with Cloudflare Turnstile ensures that bots cannot send spam emails via the contact form.
3. **Workers Logging**: Enhanced logging provides insight into form submissions and errors.

## Project Structure

- `index.ts`: Main worker script to handle incoming requests and send emails.
- `wrangler.toml`: Configuration file for the Cloudflare Worker.

## Setup

1. **Clone the repository and intall dependencies:**

   ```sh
   git clone https://github.com/your-username/mailman.git
   cd mailman
   npm install
   ```

2. **Set environment variables in `wrangler.toml`:**

    ```toml
    [vars]
    SENDER = "sender@example.com"
    RECIPIENT = "verified_recipient@example.com"
    ```
    *Note:* Set `TURNSTILE_SECRET_KEY` as a Wrangler secret either using `npx wrangler secret put <KEY>` or your Cloudflare dashboard.

3. **Start the development server:**

    ```sh
    npm run dev
    ```

4. **Deploy the worker:**

    ```sh
    npm run deploy
    ```

## Usage

Mailman accepts POST requests with form data as the body. By default, the form fields include firstName, lastName, email, and message. Turnstile adds a hidden cf-turnstile-response field for server-side validation.

### Example Form

```html
<form action="https://your-worker-url.workers.dev" method="POST">
  <label for="firstName">First Name:</label>
  <input type="text" id="firstName" name="firstName" required>

  <label for="lastName">Last Name:</label>
  <input type="text" id="lastName" name="lastName" required>

  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>

  <label for="message">Message:</label>
  <textarea id="message" name="message" required></textarea>

  <!-- Turnstile widget -->
  <div class="cf-turnstile" data-sitekey="your-site-key"></div>

  <button type="submit">Send Message</button>
</form>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
```

### Example Request

You can also send a POST request using `curl`:

```sh
curl -X POST https://your-worker-url.workers.dev \
  -d "firstName=John&lastName=Doe&email=john.doe@example.com&reason=Just%20saying%20hi!"
```

### Turnstile Validation

The server validates Turnstile tokens using Cloudflare’s `siteverify` API to block invalid submissions. Logs are added to your Cloudflare Worker dashboard to help track successful and failed attempts.

## License

This project is licensed under the MIT License.

Feel free to contribute to this project by opening issues or submitting pull requests on GitHub.
