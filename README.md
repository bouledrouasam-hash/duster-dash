# Duster Dash landing page

Static site: `index.html` + `assets/`. No build step. Drop the `site/` folder on Netlify or GitHub Pages.
Local preview: `cd site && python3 -m http.server 8000`

## Fill in before going live: `assets/config.js`
| Key | What |
|---|---|
| `FORM_ENDPOINT` | Where Name + Email are POSTed (Formspree URL or Google Apps Script web-app URL). Empty = nothing is sent. |
| `FORM_MODE` | `"json"` (Formspree etc.) or `"form"` (urlencoded, no-cors; Google Apps Script style) |
| `DOWNLOAD_URL` | Link shown after the form is submitted |
| `COMPANION_DOWNLOAD_URL` | Optional second link (phone app); empty = hidden |
| `BUY_URL` | "Buy now, $9.99" checkout link |
| `FEEDBACK_URL` | Feedback form URL or `mailto:` link |
| `PRICE`, `TRIAL_DAYS` | Display values ($9.99, 14) |

Also: set an absolute URL for `og:image` in `index.html` once the domain is known.
Payload sent: `name, email, source (trial|download), page, submitted_at, _subject, _gotcha (honeypot)`.
Note: the gate is client-side. The download URL is in `config.js`, so it is a lead-capture gate, not access control.
