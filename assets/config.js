/* =====================================================================
   CONFIG: EDIT THIS FILE BEFORE GOING LIVE
   Everything you need to fill in is in this one block.
   ===================================================================== */
window.DUSTER_CONFIG = {
  // Where the lead form is sent (POST).
  //  - FormSubmit (no account; first real submit emails you an activation link):
  //                    "https://formsubmit.co/ajax/you@example.com"   (FORM_MODE "json")
  //  - Formspree:        "https://formspree.io/f/XXXXXXXX"            (FORM_MODE "json")
  //  - Google Apps Script web app: "https://script.google.com/macros/s/XXXX/exec"  (FORM_MODE "form")
  //  - Leave "" to skip sending (the download still unlocks, but you capture NO leads).
  FORM_ENDPOINT: "https://formsubmit.co/ajax/Bouledrouasam@hotmail.com",

  // "json" = JSON body (FormSubmit AJAX, Formspree and most form backends; needs CORS and a readable response).
  // "form" = urlencoded body sent with no-cors (Google Apps Script style; response not readable, treated as success).
  FORM_MODE: "json",

  // Link revealed after a successful form submit (the Duster Dash APK / download page).
  DOWNLOAD_URL: "downloads/duster-dash-v1.0.24.apk",

  // Optional: second download button for the phone app (Duster Companion). Leave "" to hide it.
  COMPANION_DOWNLOAD_URL: "downloads/duster-companion-v1.4.12.apk",

  // "Buy now, $9.99" button target (your checkout / payment-provider link). No payment fields live on this page.
  BUY_URL: "https://dusterdash.gumroad.com/l/tbhofu",

  // Feedback link: a form URL or a mailto: link.
  FEEDBACK_URL: "mailto:you@example.com?subject=Duster%20Dash%20feedback",

  // Optional display values
  PRICE: "$9.99",
  TRIAL_DAYS: 14
};
/* ===================== END CONFIG ===================== */
