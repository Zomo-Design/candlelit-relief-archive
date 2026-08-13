# Real Gallery Public Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the one-card neutral demo with the complete ten-card Zomo Design gallery while keeping software under MIT, reserving rights to visual assets, and excluding private machine and deployment data.

**Architecture:** Keep the already-audited public `index.html` and its accessibility/fallback behavior. Add only the runtime assets used by the private final gallery, drive all ten cards through `gallery-config.json`, and make `scripts/validate.mjs` enforce the multi-card manifest, licensing boundary, relative paths, and privacy checks before publication.

**Tech Stack:** HTML, CSS, vanilla JavaScript, WebGL2, JSON, SVG, WebP/JPEG/PNG/MP4, Node.js validation, Bash local server, GitHub Actions.

## Global Constraints

- The private final-gallery directory is read-only and is referenced locally through `PRIVATE_GALLERY_SOURCE`; its absolute path must never be committed.
- Publish all ten named card folders and exactly four runtime textures per card.
- Publish only the optimized sconce loop and poster, not the unused source video.
- Do not publish Finder metadata, local deployment linkage, old preview scripts, single-card debug pages, credentials, IDs, or absolute machine paths.
- Software code remains MIT licensed.
- Card textures, brand mark, custom cursor, sconce video, and poster remain © Zomo Design, all rights reserved, and are excluded from MIT.
- Preserve keyboard access, dialog semantics, focus restoration, reduced-motion behavior, mobile pointer support, and static-image fallback.
- Work on `agent/publish-real-gallery-assets`; do not modify the private final-gallery directory.

## File Structure

- `gallery-config.json`: real exhibition copy, ten-card order, carousel/lightbox values, and optimized sconce video path.
- `index.html`: audited gallery runtime with real brand mark, custom cursor, and sconce poster references.
- `scripts/validate.mjs`: manifest, privacy, JavaScript, external URL, mixed-license, and required-root-asset validation.
- `ASSETS.md`: asset inventory and provenance boundary.
- `ASSET_LICENSE.md`: rights-reserved terms for visual assets.
- `README.md`: public setup, real-gallery description, asset map meanings, and mixed-license explanation.
- `card-back-logo.svg`, `cursor-candle.png`, `candle-sconce-loop.mp4`, `candle-sconce-poster.png`: real runtime brand and sconce assets.
- Ten card directories: each contains `card-config.json`, original/albedo, normal, height, and roughness textures.
- `docs/superpowers/specs/2026-08-09-real-gallery-public-release-design.md`: approved design.

---

### Task 1: Make validation describe the real public gallery

**Files:**
- Modify: `scripts/validate.mjs`

**Interfaces:**
- Consumes: `gallery-config.json`, every listed `card-config.json`, required root runtime assets, `ASSETS.md`, and `ASSET_LICENSE.md`.
- Produces: a zero-exit validation result only when the full real gallery is present and privacy/licensing checks pass.

- [ ] **Step 1: Add the failing multi-card and root-asset requirements**

Add these constants after `resolvedRoot`:

```js
const requiredRootAssets = [
  "card-back-logo.svg",
  "cursor-candle.png",
  "candle-sconce-loop.mp4",
  "candle-sconce-poster.png",
  "ASSET_LICENSE.md",
];
const minimumPublicCardCount = 2;
```

After loading `gallery-config.json`, require multiple cards:

```js
if (!Array.isArray(gallery.order) || gallery.order.length < minimumPublicCardCount) {
  throw new Error(`gallery-config.json must include at least ${minimumPublicCardCount} cards`);
}
```

After the existing required-document loop, validate root assets and the mixed-license notice:

```js
for (const file of requiredRootAssets) await requireFile(file);

const assetLicense = await readFile(path.join(root, "ASSET_LICENSE.md"), "utf8");
for (const phrase of ["All rights reserved", "not licensed under the MIT License", "Zomo Design"]) {
  if (!assetLicense.includes(phrase)) {
    throw new Error(`ASSET_LICENSE.md is missing required phrase: ${phrase}`);
  }
}
```

Remove the assembled uppercase brand-name token from `privateTokens`; keep the private tool-name, user-directory, deployment-directory, credential, and secret-pattern checks.

- [ ] **Step 2: Run validation and verify it fails for the current one-card demo**

Run:

```bash
node scripts/validate.mjs
```

Expected: non-zero exit with `gallery-config.json must include at least 2 cards`.

- [ ] **Step 3: Check syntax and commit the validation contract**

Run:

```bash
node --check scripts/validate.mjs
git diff --check
git add scripts/validate.mjs
git commit -m "test: require complete real gallery assets"
```

Expected: syntax and diff checks exit `0`; one commit contains only `scripts/validate.mjs`.

---

### Task 2: Import the exact runtime asset set

**Files:**
- Create: `cat-portrait/*`
- Create: `gilded-muse/*`
- Create: `november-forest/*`
- Create: `red-poppies/*`
- Create: `hibiscus/*`
- Create: `narcissus/*`
- Create: `sword-book/*`
- Create: `theatre-poster/*`
- Create: `infp/*`
- Create: `nature-stamp/*`
- Create: `card-back-logo.svg`
- Create: `cursor-candle.png`
- Create: `candle-sconce-loop.mp4`
- Create: `candle-sconce-poster.png`
- Delete: `demo-card/`
- Delete: `relief-mark.svg`

**Interfaces:**
- Consumes: the read-only private gallery directory supplied by `PRIVATE_GALLERY_SOURCE`.
- Produces: repository-local runtime assets referenced only through relative paths.

- [ ] **Step 1: Confirm the source variable and expected source files**

Run:

```bash
: "${PRIVATE_GALLERY_SOURCE:?Set PRIVATE_GALLERY_SOURCE to the private final-gallery directory}"
for card in cat-portrait gilded-muse november-forest red-poppies hibiscus narcissus sword-book theatre-poster infp nature-stamp; do
  test -f "$PRIVATE_GALLERY_SOURCE/$card/card-config.json"
done
test -f "$PRIVATE_GALLERY_SOURCE/card-back-logo.svg"
test -f "$PRIVATE_GALLERY_SOURCE/cursor-candle.png"
test -f "$PRIVATE_GALLERY_SOURCE/candle-sconce-loop.mp4"
test -f "$PRIVATE_GALLERY_SOURCE/candle-sconce-poster.png"
```

Expected: exit `0` and no output.

- [ ] **Step 2: Copy only the four configured textures and config per card**

For each card, read `assets.albedo`, `assets.normal`, `assets.height`, and `assets.roughness` from its config, create the target directory, and copy only those five files. The implementation loop must fail if a configured filename is missing:

```bash
for card in cat-portrait gilded-muse november-forest red-poppies hibiscus narcissus sword-book theatre-poster infp nature-stamp; do
  mkdir -p "$card"
  cp "$PRIVATE_GALLERY_SOURCE/$card/card-config.json" "$card/card-config.json"
  for key in albedo normal height roughness; do
    file=$(jq -r ".assets.$key" "$card/card-config.json")
    test "$file" != "null"
    cp "$PRIVATE_GALLERY_SOURCE/$card/$file" "$card/$file"
  done
done
```

- [ ] **Step 3: Copy only the used brand and sconce files**

Run:

```bash
cp "$PRIVATE_GALLERY_SOURCE/card-back-logo.svg" card-back-logo.svg
cp "$PRIVATE_GALLERY_SOURCE/cursor-candle.png" cursor-candle.png
cp "$PRIVATE_GALLERY_SOURCE/candle-sconce-loop.mp4" candle-sconce-loop.mp4
cp "$PRIVATE_GALLERY_SOURCE/candle-sconce-poster.png" candle-sconce-poster.png
git rm -r demo-card relief-mark.svg
```

Expected: the four root assets exist; the neutral demo directory and mark are staged for deletion.

- [ ] **Step 4: Prove excluded files did not enter the worktree**

Run:

```bash
find . -name '.DS_Store' -o -name '.vercel' -o -name 'candle.mp4' -o -name 'start-preview.sh'
find . -mindepth 2 -name 'index.html'
```

Expected: both commands print nothing.

---

### Task 3: Restore the real ten-card presentation without regressing the runtime

**Files:**
- Modify: `gallery-config.json`
- Modify: `index.html`

**Interfaces:**
- Consumes: the imported root assets and ten card directories.
- Produces: the real Zomo Design carousel and lightbox while retaining the audited interaction implementation.

- [ ] **Step 1: Replace the gallery configuration with supported real values**

Set the exhibition block to:

```json
{
  "title": "Candlelit Relief Archive",
  "logoLine1": "Zomo Design",
  "logoLine2": "ARCHIVE",
  "topCenterLeft": "OBJECTS IN LIGHT",
  "topCenterRight": "MEMORIES IN RELIEF",
  "aboutText": "About",
  "hintDesktop": "DRAG · SCROLL · ← → TO EXPLORE — CLICK A CARD TO INSPECT",
  "hintMobile": "SWIPE TO EXPLORE — TAP A CARD TO INSPECT"
}
```

Set `order` exactly to:

```json
[
  "cat-portrait",
  "gilded-muse",
  "november-forest",
  "red-poppies",
  "hibiscus",
  "narcissus",
  "sword-book",
  "theatre-poster",
  "infp",
  "nature-stamp"
]
```

Keep only the currently supported carousel keys and set `fx.candleVideo` to `candle-sconce-loop.mp4`.

- [ ] **Step 2: Point the audited page at the real visual assets**

In `index.html`:

```html
<img class="carousel-brand__emblem" src="card-back-logo.svg" alt="" aria-hidden="true">
```

Set the lightbox cursor rule to:

```css
#lightbox.on { cursor: url(cursor-candle.png) 64 6, auto; }
```

Add the poster while retaining muted inline autoplay and the CSS fallback:

```html
<video class="candle-video" id="candleVideo" autoplay muted loop playsinline
       preload="metadata" poster="candle-sconce-poster.png" disablepictureinpicture></video>
```

Update embedded defaults to the real brand copy and optimized sconce loop, but do not restore removed inert configuration keys.
Keep the rendered brand uppercase by adding `text-transform: uppercase` to `.carousel-brand__name`.

- [ ] **Step 3: Verify configuration and inline JavaScript parse**

Run:

```bash
jq empty gallery-config.json
for file in */card-config.json; do jq empty "$file"; done
node --check scripts/validate.mjs
git diff --check
```

Expected: all commands exit `0`.

---

### Task 4: Establish the mixed-license boundary and public documentation

**Files:**
- Create: `ASSET_LICENSE.md`
- Modify: `ASSETS.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: the exact asset inventory from Tasks 2 and 3.
- Produces: a clear legal boundary between MIT software and rights-reserved visuals.

- [ ] **Step 1: Create the visual asset license**

Create `ASSET_LICENSE.md` with these operative terms:

```markdown
# Visual Asset License

Copyright © 2026 Zomo Design. All rights reserved.

The card artwork and texture maps in the ten card directories, together with
`card-back-logo.svg`, `cursor-candle.png`, `candle-sconce-loop.mp4`, and
`candle-sconce-poster.png`, are not licensed under the MIT License.

They are included so people can view and run this repository as a complete
demonstration. No permission is granted to extract, reproduce, redistribute,
sell, sublicense, train on, or use these visual assets in another project
without prior written permission from Zomo Design.

The software code remains available under the repository's MIT License.
```

- [ ] **Step 2: Replace the demo-only asset statement**

Update `ASSETS.md` to list the ten card directories and four root visual assets, link to `ASSET_LICENSE.md`, and state that imported third-party replacements must be licensed by their contributor.

- [ ] **Step 3: Update README for the real gallery**

Replace references to a neutral geometric demo with the ten-card Zomo Design exhibition. Keep local-run and map-meaning instructions. Replace the license section with:

```markdown
## License

The software code is available under the [MIT License](LICENSE).

The included card artwork, texture maps, brand mark, cursor, and sconce media
are © Zomo Design and are not covered by MIT. See
[ASSET_LICENSE.md](ASSET_LICENSE.md) and [ASSETS.md](ASSETS.md).
```

- [ ] **Step 4: Run the now-satisfied validator and commit the gallery**

Run:

```bash
node scripts/validate.mjs
bash -n start-gallery.sh
xmllint --noout card-back-logo.svg
git diff --check
```

Expected: validation reports `10 card(s)` and every command exits `0`.

Stage the exact public scope and commit:

```bash
git add ASSET_LICENSE.md ASSETS.md README.md gallery-config.json index.html scripts/validate.mjs \
  card-back-logo.svg cursor-candle.png candle-sconce-loop.mp4 candle-sconce-poster.png \
  cat-portrait gilded-muse november-forest red-poppies hibiscus narcissus \
  sword-book theatre-poster infp nature-stamp
git commit -m "feat: publish real ten-card gallery"
```

Expected: no Finder metadata, deployment linkage, old preview scripts, or unused source video appears in `git show --stat --oneline HEAD`.

---

### Task 5: Verify the full experience in a real browser

**Files:**
- Test only; no required repository changes.

**Interfaces:**
- Consumes: the committed branch from Task 4.
- Produces: evidence that the real gallery, fallback paths, and privacy boundary work before publication.

- [ ] **Step 1: Start the portable local server**

Run:

```bash
NO_OPEN=1 PORT=8188 ./start-gallery.sh
```

Expected: output contains `http://127.0.0.1:8188/` and the server binds only to `127.0.0.1`.

- [ ] **Step 2: Verify desktop multi-card behavior**

Open the preview at `1440 × 900` and assert:

```text
10 card buttons are present.
At least 3 differently positioned cards are visible in the initial viewport.
The title changes after ArrowRight.
Dragging and wheel input change the carousel position.
Opening a card sets aria-hidden=false on the dialog and makes the stage inert.
The WebGL2 canvas becomes visible and pointer movement changes the card transform.
Next/previous controls switch to a different card title.
Escape closes the dialog and restores focus to the originating card.
No console errors, page errors, or failed non-HEAD requests occur.
```

- [ ] **Step 3: Verify accessibility and fallbacks**

Run additional browser contexts and assert:

```text
At 390 × 844, touch/pointer input opens and tilts a card without horizontal page overflow.
With prefers-reduced-motion=reduce, sway and transition motion are disabled and the card remains usable.
When WebGL2 context creation returns null, the static original stays visible and the fallback notice appears.
```

- [ ] **Step 4: Capture a release screenshot**

Capture the initial multi-card carousel and one opened real card. Store screenshots outside the repository unless the README is deliberately updated to include them and the images are listed in `ASSET_LICENSE.md`.

---

### Task 6: Publish through a reviewed pull request and merge after green checks

**Files:**
- No additional source files unless verification finds a defect.

**Interfaces:**
- Consumes: verified commits on `agent/publish-real-gallery-assets`.
- Produces: merged `main`, successful GitHub Actions, and a public ten-card gallery repository.

- [ ] **Step 1: Run the final local release gate**

Run:

```bash
node scripts/validate.mjs
bash -n start-gallery.sh
git diff --check main...HEAD
git status --short
git log --format='%an <%ae> | %cn <%ce>' main..HEAD | sort -u
```

Expected: `10 card(s)` validated, clean Bash/diff checks, clean worktree, and only `Zomo-Design <265985034+Zomo-Design@users.noreply.github.com>` as author/committer.

- [ ] **Step 2: Push the branch and open a Draft Pull Request**

Run:

```bash
git push -u origin agent/publish-real-gallery-assets
```

Open a Draft PR targeting `main` titled `Publish real ten-card relief gallery`. The body must summarize the ten-card migration, mixed-license boundary, excluded private files, and local validation evidence.

- [ ] **Step 3: Wait for GitHub Actions and inspect the public PR tree**

Expected GitHub Actions result: `Validate static gallery` completes with `success` for the PR head SHA.

Verify the PR file list contains the ten cards and four root visual assets, and does not contain Finder metadata, `.vercel`, old preview scripts, unused source video, absolute paths, or credential-like strings.

- [ ] **Step 4: Mark ready and merge only after the release gate is green**

Run:

```bash
gh pr ready
gh pr merge --squash --delete-branch
git switch main
git pull --ff-only origin main
node scripts/validate.mjs
```

Expected: the PR is merged, `main` is updated without local divergence, and the final validator reports `10 card(s)`.
