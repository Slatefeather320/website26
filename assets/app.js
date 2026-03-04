import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

const noteTitleEl = document.getElementById("note-title");
const noteContentEl = document.getElementById("note-content");
const bgToggleInput = document.getElementById("bg-toggle-input");

let notes = [];

function splitWikiLabel(label) {
  const [target, alias] = label.split("|").map((x) => x.trim());
  return { target: target || label.trim(), alias: alias || target || label.trim() };
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/\.md$/i, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function findNoteByLabel(label) {
  const { target } = splitWikiLabel(label);
  const cleaned = target.replace(/\.md$/i, "").toLowerCase();
  return notes.find(
    (n) =>
      n.slug.toLowerCase() === cleaned ||
      n.basename.toLowerCase() === cleaned ||
      n.title.toLowerCase() === cleaned ||
      n.slug.toLowerCase() === slugify(cleaned)
  );
}

function noteUrlLookup(label) {
  const note = findNoteByLabel(label);
  if (note) return `#${note.slug}`;

  const { target } = splitWikiLabel(label);
  return `#${slugify(target)}`;
}

function getCurrentSlug() {
  return location.hash.replace(/^#/, "").trim().toLowerCase();
}

function getHomeNote() {
  return notes.find((n) => n.basename.toLowerCase() === "home") ?? notes[0];
}

function normalizeSlug(slug) {
  if (slug === "index") return "home";
  if (slug === "blogs") return "blog";
  return slug;
}

function renderNoteFromSlug(slug) {
  const home = getHomeNote();
  const note = slug ? notes.find((n) => n.slug === slug) : home;

  if (!note) {
    noteTitleEl.textContent = "No notes found";
    noteContentEl.innerHTML = "";
    return;
  }

  noteTitleEl.textContent = note.title;

  const linked = note.markdown
    .replace(/!\[\[([^\]]+)\]\]/g, (_, image) => {
      const { target } = splitWikiLabel(image);
      return `![](${encodeURI(target)})`;
    })
    .replace(/\[\[([^\]]+)\]\]/g, (_, label) => {
      const { alias } = splitWikiLabel(label);
      return `[${alias}](${noteUrlLookup(label)})`;
    });

  noteContentEl.innerHTML = marked.parse(linked);
}

function renderNotFound(slug) {
  noteTitleEl.textContent = "Page not found";

  const home = getHomeNote();
  const homeLink = home ? `#${home.slug}` : "#";
  noteContentEl.innerHTML = `<p>This page is only reachable by a valid wiki link or manual URL.</p><p><a href="${homeLink}">Return home</a></p>`;
}

function renderRoute() {
  const rawSlug = getCurrentSlug();
  const slug = normalizeSlug(rawSlug);
  if (rawSlug && rawSlug !== slug) {
    location.replace(`#${slug}`);
    return;
  }

  if (!slug) {
    const home = getHomeNote();
    if (home && location.hash !== `#${home.slug}`) {
      location.replace(`#${home.slug}`);
      return;
    }
  }

  const effectiveSlug = normalizeSlug(getCurrentSlug());
  const note = effectiveSlug === "home" ? getHomeNote() : notes.find((n) => n.slug === effectiveSlug);
  if (note) {
    renderNoteFromSlug(note.slug);
  } else {
    renderNotFound(effectiveSlug);
  }
}

function setAnimatedBackground(enabled) {
  document.body.classList.toggle("static-bg", !enabled);
  if (bgToggleInput) bgToggleInput.checked = enabled;
  localStorage.setItem("animated_background", enabled ? "on" : "off");
}

function initBackgroundToggle() {
  if (!bgToggleInput) return;

  const saved = localStorage.getItem("animated_background");
  const enabled = saved !== "off";
  setAnimatedBackground(enabled);

  bgToggleInput.addEventListener("change", () => {
    setAnimatedBackground(bgToggleInput.checked);
  });
}

async function init() {
  initBackgroundToggle();

  const res = await fetch("data/notes.json");
  const data = await res.json();
  notes = data.notes;

  renderRoute();
  window.addEventListener("hashchange", renderRoute);
}

init().catch((err) => {
  noteTitleEl.textContent = "Error loading notes";
  noteContentEl.textContent = String(err);
});
