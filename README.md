# Mailman

Mailman is a project that sends contact form data in an email to a specified recipient using [Cloudflare Workers and Cloudflare Email Routing](https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/).

## Prerequisites

- Cloudflare account with Email Routing enabled.
- Verified email addresses in Cloudflare Email Routing.

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

2. **Set emails in `wrangler.toml`:**

    ```toml
    [vars]
    SENDER = "sender@example.com"
    RECIPIENT = "verified_recipient@example.com"
    ```

3. **Start the development server:**

    ```sh
    npm run dev
    ```

4. **Deploy the worker:**

    ```sh
    npm run deploy
    ```

## Usage

Mailman accepts POST requests with form data as the body. By default, the form fields include `firstName`, `lastName`, `email`, and `message`.

### Example Form

```html
<form action="https://your-worker-url.workers.dev" method="POST">
  <label for="firstName">First Name:</label>
  <input type="text" id="firstName" name="firstName" required>

  <label for="lastName">Last Name:</label>
  <input type="text" id="lastName" name="lastName" required>

  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>

  <label for="reason">Reason:</label>
  <textarea id="reason" name="reason" required></textarea>

  <button type="submit">Send Message</button>
</form>
```

### Example Request

You can also send a POST request using `curl`:

```sh
curl -X POST https://your-worker-url.workers.dev \
  -d "firstName=John&lastName=Doe&email=john.doe@example.com&reason=Just%20saying%20hi!"
```

## License

This project is licensed under the MIT License.

Feel free to contribute to this project by opening issues or submitting pull requests on GitHub.
