(() => {
  "use strict";

  const APPS = {
    birthday: "https://parmjee2026.github.io/Birthday-Reminder-Web-App/",
    japa: "https://parmeshwarbtpl-rgb.github.io/japa-counter/"
  };
  const KEY = "myAppsHub.profile.v1";

  const nameEl = document.getElementById("userName");
  const avatarEl = document.getElementById("avatar");
  const inputEl = document.getElementById("nameInput");

  function clean(value) {
    return String(value || "").replace(/^welcome\s*,?\s*/i, "").trim();
  }

  function loadName() {
    try {
      return clean(JSON.parse(localStorage.getItem(KEY) || "{}").name);
    } catch (_) {
      return "";
    }
  }

  function saveName(name) {
    name = clean(name).slice(0, 80);
    try {
      localStorage.setItem(KEY, JSON.stringify({name, savedAt: Date.now()}));
    } catch (_) {}
    render(name);
  }

  function render(name) {
    const shown = name || "Guest";
    nameEl.textContent = shown;
    avatarEl.textContent = shown === "Guest" ? "G" : shown.charAt(0).toUpperCase();
    inputEl.value = name;
  }

  function openApp(kind) {
    const target = new URL(APPS[kind]);
    target.searchParams.set("enter", "1");

    const name = loadName();
    const hash = new URLSearchParams();
    if (name) hash.set("suite_name", name);
    hash.set("suite_enter", "1");
    target.hash = hash.toString();

    window.location.assign(target.toString());
  }

  document.querySelectorAll("[data-app]").forEach(card => {
    card.addEventListener("click", event => {
      event.preventDefault();
      openApp(card.dataset.app);
    });
  });

  document.getElementById("saveName").addEventListener("click", () => saveName(inputEl.value));
  inputEl.addEventListener("keydown", event => {
    if (event.key === "Enter") saveName(inputEl.value);
  });

  render(loadName());

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
  }
})();
