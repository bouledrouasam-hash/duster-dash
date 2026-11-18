# Duster Dash landing page

Static site: `index.html` + `assets/`. No build step. Drop the `site/` folder on Netlify or GitHub Pages.
Local preview: `cd site && python3 -m http.server 8000`

## Fill in before going live: `assets/config.js`
| Key | What |
|---|---|
| `FORM_ENDPOINT` | Where the lead form is POSTed. Default is FormSubmit AJAX to `Bouledrouasam@hotmail.com` (no account; first real submission sends an activation email you must click). Formspree or a Google Apps Script URL also work. Empty = nothing is sent. |
| `FORM_MODE` | `"json"` (FormSubmit AJAX, Formspree etc.) or `"form"` (urlencoded, no-cors; Google Apps Script style) |
| `DOWNLOAD_URL` | Link shown after the form is submitted |
| `COMPANION_DOWNLOAD_URL` | Optional second link (phone app); empty = hidden |
| `BUY_URL` | "Buy now, $9.99" checkout link |
| `FEEDBACK_URL` | Feedback form URL or `mailto:` link |
| `PRICE`, `TRIAL_DAYS` | Display values ($9.99, 14) |

Also: set an absolute URL for `og:image` in `index.html` once the domain is known.
Payload sent: `name, email, phone, car, head_unit, source (trial|download), src` (from `?src=` in the URL, e.g. `fb`), `page, submitted_at, _subject, _captcha, _template, _replyto`. Honeypot `_gotcha` is checked in the browser and not sent.
Note: the gate is client-side. The download URL is in `config.js`, so it is a lead-capture gate, not access control. If the form backend fails, the download still starts.

## Behaviour when config values are empty
- `BUY_URL` empty: every Buy button (and the "Can I just buy it" FAQ) is hidden; the success dialog says license codes are coming soon.
- `FEEDBACK_URL` empty or still the `you@example.com` placeholder: feedback links are hidden.
- `FORM_ENDPOINT` empty: the download still unlocks, but no lead is captured (console warning).
- Form backend error: the download still starts; a toast says the details could not be saved.

## Image slots (swap a file by keeping its name and size ratio)
Every `<img>` has a `data-slot` attribute. Files:
| Slot | File(s) | Kind |
|---|---|---|
| hero, real-driving | `assets/live/live-3-driving-nav-{800,1200,1600}.webp` (16:10) | Real photo (street, song, mini-map blurred) |
| real-night | `assets/live/live-2-lowbeam-media-{800,1200,1600}.webp` | Real photo (video title/channel blurred) |
| real-parked | `assets/live/live-1-alerts-parked-{800,1200,1600}.webp` | Real photo |
| feature-live / feature-media-map / feature-brake-limit / feature-settings | `assets/dash-*.webp` (1280x800) | Mockups (street name, map, track title blurred) |
| testing-hood / testing-dashcam | `assets/renders/dash-hood-view-*.webp`, `assets/renders/dash-dashcam-left-*.webp` | Renders from test builds (section `#testing`, delete it to remove) |
| companion-status, companion-light-* | `assets/companion-*.webp` | Mockups |
| og:image | `assets/og-live-1200x628.jpg` | Real photo crop |
Real 1280x800 screencaps (e.g. `adb exec-out screencap -p`) would be best for the feature slots and real phone screenshots for the Companion slots.
