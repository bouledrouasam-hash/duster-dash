/* Duster landing page logic. Settings live in assets/config.js (loaded first). */
(function () {
  "use strict";
  var C = window.DUSTER_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ---- fill display values from config
  $$("[data-price]").forEach(function (n) { n.textContent = C.PRICE || "$9.99"; });
  $$("[data-trial]").forEach(function (n) { n.textContent = C.TRIAL_DAYS || 14; });

  // ---- toast
  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.remove("hidden");
    clearTimeout(toastEl._t); toastEl._t = setTimeout(function () { toastEl.classList.add("hidden"); }, 4000);
  }

  // ---- buy + feedback links (degrade gracefully when not configured)
  function isPlaceholder(u) { return !u || /you@example\.com|XXXX/i.test(u); }
  var hasBuy = !isPlaceholder(C.BUY_URL), hasFeedback = !isPlaceholder(C.FEEDBACK_URL);
  if (!hasBuy) {
    console.info("BUY_URL is not set in assets/config.js: Buy buttons are hidden.");
    $$(".needs-buy, [data-buy]").forEach(function (n) { n.classList.add("hidden"); });
    $$(".no-buy").forEach(function (n) { n.classList.remove("hidden"); });
  }
  $$("[data-buy]").forEach(function (a) {
    if (hasBuy) { a.href = C.BUY_URL; a.target = "_blank"; a.rel = "noopener"; }
    else a.addEventListener("click", function (e) { e.preventDefault(); toast("Buying isn't open yet. Start the free trial instead."); });
  });
  if (!hasFeedback) {
    console.info("FEEDBACK_URL is empty or a placeholder in assets/config.js: feedback links are hidden.");
    $$(".needs-feedback, [data-feedback]").forEach(function (n) { n.classList.add("hidden"); });
  }
  $$("[data-feedback]").forEach(function (a) { if (hasFeedback) a.href = C.FEEDBACK_URL; });

  // ---- download gate
  var dlg = $("#gate"), form = $("#gate-form");
  var viewForm = $("#gate-form-view"), viewDone = $("#gate-done-view");
  var nameI = $("#f-name"), emailI = $("#f-email"), srcI = $("#f-source");
  var errName = $("#e-name"), errEmail = $("#e-email"), formErr = $("#form-error"), submitB = $("#gate-submit");
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var lastOpener = null;

  function reveal(name) {
    $("#done-title").textContent = name ? "Thanks, " + name.split(" ")[0] + "!" : "Thanks!";
    var dl = $("#dl-link");
    if (C.DOWNLOAD_URL) {
      dl.href = C.DOWNLOAD_URL; dl.classList.remove("hidden");
    } else {
      dl.removeAttribute("href"); dl.textContent = "Download link not set yet"; dl.setAttribute("aria-disabled", "true");
      $("#dl-meta").textContent = "The download isn't available yet. We'll follow up by email.";
      console.warn("DOWNLOAD_URL is not set in assets/config.js");
    }
    var cp = $("#dl-companion");
    if (C.COMPANION_DOWNLOAD_URL) {
      cp.href = C.COMPANION_DOWNLOAD_URL; cp.classList.remove("hidden"); $("#dl-companion-meta").classList.remove("hidden");
    }
    viewForm.classList.add("hidden"); viewDone.classList.remove("hidden");
    setTimeout(function () { $("#done-title").focus(); }, 30);
  }
  function showForm() { viewDone.classList.add("hidden"); viewForm.classList.remove("hidden"); }

  function openGate(source, opener) {
    lastOpener = opener || null;
    srcI.value = source || "trial";
    var saved = null; try { saved = JSON.parse(localStorage.getItem("duster_lead") || "null"); } catch (e) {}
    if (saved && saved.email) reveal(saved.name); else { showForm(); clearErrors(); }
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    if (!saved) setTimeout(function () { nameI.focus(); }, 30);
  }
  function closeGate() { if (dlg.close) dlg.close(); else dlg.removeAttribute("open"); if (lastOpener) lastOpener.focus(); }
  $$("[data-open-form]").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); openGate(a.getAttribute("data-open-form"), a); });
  });
  $$("[data-close]").forEach(function (b) { b.addEventListener("click", closeGate); });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) closeGate(); });

  function setErr(input, el, msg) { el.textContent = msg || ""; if (msg) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid"); }
  function clearErrors() { setErr(nameI, errName, ""); setErr(emailI, errEmail, ""); formErr.classList.add("hidden"); }
  function validate() {
    var ok = true, n = nameI.value.trim(), m = emailI.value.trim();
    if (!n) { setErr(nameI, errName, "Please enter your name."); ok = false; } else setErr(nameI, errName, "");
    if (!m) { setErr(emailI, errEmail, "Please enter your email."); ok = false; }
    else if (!EMAIL_RE.test(m)) { setErr(emailI, errEmail, "Please enter a valid email address."); ok = false; }
    else setErr(emailI, errEmail, "");
    return ok;
  }
  nameI.addEventListener("input", function () { if (nameI.value.trim()) setErr(nameI, errName, ""); });
  emailI.addEventListener("input", function () { if (EMAIL_RE.test(emailI.value.trim())) setErr(emailI, errEmail, ""); });

  function send(payload) {
    if (!C.FORM_ENDPOINT) { console.warn("FORM_ENDPOINT is empty in assets/config.js: lead NOT sent anywhere."); return Promise.resolve(); }
    if (C.FORM_MODE === "form") {
      var body = new URLSearchParams(); Object.keys(payload).forEach(function (k) { body.append(k, payload[k]); });
      // Google Apps Script style: opaque response, treat a completed request as success
      return fetch(C.FORM_ENDPOINT, { method: "POST", mode: "no-cors", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
    }
    return fetch(C.FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(payload) })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault(); formErr.classList.add("hidden");
    if (form.elements["_gotcha"].value) { return; } // bot
    if (!validate()) { (nameI.getAttribute("aria-invalid") ? nameI : emailI).focus(); return; }
    var payload = {
      name: nameI.value.trim(), email: emailI.value.trim(), source: srcI.value,
      page: location.href, submitted_at: new Date().toISOString(),
      _subject: "Duster Dash download: " + nameI.value.trim()
    };
    submitB.disabled = true; var label = submitB.textContent; submitB.textContent = "Sending...";
    send(payload).then(function () {
      try { localStorage.setItem("duster_lead", JSON.stringify({ name: payload.name, email: payload.email })); } catch (e) {}
      reveal(payload.name);
    }).catch(function (err) {
      console.error(err);
      formErr.textContent = "Sorry, we couldn't send that. Please check your connection and try again.";
      formErr.classList.remove("hidden");
    }).then(function () { submitB.disabled = false; submitB.textContent = label; });
  });
})();
