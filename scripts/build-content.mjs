import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "data", "notes.json");
const EXCLUDE = new Set(["AGENTS.md", "README.md"]);

function stripFrontMatter(raw) {
  if (!raw.startsWith("---")) return { body: raw, title: null };

  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { body: raw, title: null };

  const front = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).trim();

  const titleLine = front.split("\n").find((line) => line.trim().toLowerCase().startsWith("title:"));
  const title = titleLine ? titleLine.split(":").slice(1).join(":").trim() : null;

  return { body, title };
}

function extractTitle(filename, body, frontTitle) {
  if (frontTitle) return frontTitle;

  const heading = body
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith("# "));

  if (heading) return heading.replace(/^#\s+/, "").trim();
  return filename.replace(/\.md$/i, "");
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/\.md$/i, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

async function build() {
  const entries = await readdir(ROOT, { withFileTypes: true });
  const mdFiles = entries.filter(
    (e) => e.isFile() && e.name.toLowerCase().endsWith(".md") && !EXCLUDE.has(e.name)
  );

  const notes = [];

  for (const file of mdFiles) {
    const fullPath = path.join(ROOT, file.name);
    const raw = await readFile(fullPath, "utf8");
    const fileStat = await stat(fullPath);
    const { body, title: frontTitle } = stripFrontMatter(raw);

    const note = {
      filename: file.name,
      basename: file.name.replace(/\.md$/i, ""),
      slug: slugify(file.name),
      title: extractTitle(file.name, body, frontTitle),
      markdown: body,
      updatedAt: fileStat.mtime.toISOString()
    };

    notes.push(note);
  }

  notes.sort((a, b) => (a.filename < b.filename ? -1 : 1));

  await writeFile(OUT, `${JSON.stringify({ generatedAt: new Date().toISOString(), notes }, null, 2)}\n`, "utf8");
  console.log(`Wrote ${notes.length} notes to ${OUT}`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
