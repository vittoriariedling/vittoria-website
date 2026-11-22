// Exports the site's legacy content (JS/JSON files) to one JSON file that the
// Python importer (`python -m app.importer`) loads into Postgres.
//
//   docker compose exec web node scripts/export-content.mjs
//
// The newsletter and travel files are ES modules that `import` photos, which
// Node can't load. A loader hook turns every image import into its file path
// (relative to client/src/assets) so the importer can find and upload it.
//
// Output: client/src/assets/_export/content.json (gitignored with the assets,
// since it contains your private content).

import { registerHooks } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = path.join(ROOT, 'client', 'src', 'assets');
const OUT = path.join(ASSETS, '_export', 'content.json');
const IMAGE_RE = /\.(jpe?g|png|gif|webp|heic|avif)$/i;

registerHooks({
  load(url, context, nextLoad) {
    if (IMAGE_RE.test(new URL(url).pathname)) {
      const rel = path.relative(ASSETS, fileURLToPath(url)).split(path.sep).join('/');
      return { format: 'module', source: `export default ${JSON.stringify({ $image: rel })};`, shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});

const load = (rel) => import(pathToFileURL(path.join(ASSETS, rel)).href);
const readJson = async (rel) => JSON.parse(await readFile(path.join(ROOT, rel), 'utf8'));

const { allNewsletters } = await load('newsletters/index.js');
const { visitedCountries, visitedStates } = await load('travelData.js');
const books = await readJson('content/Books.json');
const projects = await readJson('content/CodingProjects.json');

// Newest first in index.js; give each a position so higher = newer.
const posts = allNewsletters.map((n, i) => ({ ...n, position: allNewsletters.length - i }));

// Site-wide copy (landing page, page intros...). Private, like the
// rest of client/src/assets. File references inside use {"$file": "path"} for
// files uploaded as-is (videos) or {"$image": "path"} for photos.
let site = null;
try {
  site = JSON.parse(await readFile(path.join(ASSETS, 'site', 'site.json'), 'utf8'));
} catch (e) {
  if (e.code !== 'ENOENT') throw e;
  console.warn('note: client/src/assets/site/site.json not found; skipping site content');
}

const content = { exportedAt: new Date().toISOString(), books, projects, posts, countries: visitedCountries, states: visitedStates, site };
await mkdir(path.dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(content, null, 2));

const images = JSON.stringify(content).match(/"\$image"/g)?.length ?? 0;
console.log(`Wrote ${path.relative(ROOT, OUT)}: ${books.length} books, ${projects.length} projects, `
  + `${posts.length} posts, ${visitedCountries.length} countries, ${visitedStates.length} states, ${images} image references`);
