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

## Behaviour when config values are empty
- `BUY_URL` empty: every Buy button (and the "Can I just buy it" FAQ) is hidden; the success dialog says license codes are coming soon.
- `FEEDBACK_URL` empty or still the `you@example.com` placeholder: feedback links are hidden.
- `FORM_ENDPOINT` empty: the download still unlocks, but no lead is captured (console warning).

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
