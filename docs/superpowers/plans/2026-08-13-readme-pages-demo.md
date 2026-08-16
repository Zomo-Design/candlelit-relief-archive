# README Preview and GitHub Pages Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one optimized hero preview and a prominent live-demo entrance to the repository README, then publish and verify the complete ten-card gallery with GitHub Pages.

**Architecture:** Keep the existing static gallery unchanged and publish the repository root directly from `main`. Add one rights-reserved WebP preview under `docs/images/`, reference the canonical Pages URL from the README, extend the existing validator to recognize that reviewed URL and presentation asset, and configure the repository homepage to the same URL.

**Tech Stack:** Markdown/HTML, WebP, Node.js validation, Bash, GitHub Pages, GitHub CLI, Playwright browser verification.

## Global Constraints

- Use exactly one README preview image: the user-provided 1280×1280 PNG supplied outside the repository.
- Do not modify or delete the source PNG.
- Save the optimized file as `docs/images/candlelit-relief-archive-preview.webp`.
- Use `https://zomo-design.github.io/candlelit-relief-archive/` as the canonical Demo URL.
- Both the preview image and `▶ Open Live Demo` must link to the canonical Demo URL.
- Publish the repository root from `main`; do not add a build system or third-party host.
- Add the preview to the rights-reserved visual-asset boundary; do not license it under MIT.
- Do not add a second screenshot, GIF, video, or redesign the gallery.
- Pass the private source location through `PREVIEW_SOURCE`; never commit its machine path.
- Work on `agent/add-pages-demo` and publish through a reviewed pull request.

## File Structure

- `docs/images/candlelit-relief-archive-preview.webp`: optimized README hero preview.
- `README.md`: title, short description, linked hero preview, centered Demo entrance, then existing documentation.
- `ASSETS.md`: public inventory entry for the README preview.
- `ASSET_LICENSE.md`: explicit inclusion of the README preview in the rights-reserved set.
- `scripts/validate.mjs`: canonical Demo URL allowlist plus required preview and README-fragment checks.
- `docs/superpowers/specs/2026-08-13-readme-pages-demo-design.md`: approved design.

---

### Task 1: Add the licensed README preview and Demo entrance

**Files:**
- Create: `docs/images/candlelit-relief-archive-preview.webp`
- Modify: `README.md`
- Modify: `ASSETS.md`
- Modify: `ASSET_LICENSE.md`
- Modify: `scripts/validate.mjs`

**Interfaces:**
- Consumes: `PREVIEW_SOURCE`, the approved source PNG; the existing README and mixed-license files.
- Produces: one optimized preview and a validator-enforced canonical Demo presentation.

- [ ] **Step 1: Prove the current validator rejects the newly approved external URL**

Run:

```bash
node scripts/validate.mjs
```

Expected: non-zero exit containing:

```text
contains an unreviewed external URL: https://zomo-design.github.io/candlelit-relief-archive/
```

This failure is caused by the approved design spec already documenting the canonical URL; it proves the URL review check is active.

- [ ] **Step 2: Add the canonical URL and README presentation contract to the validator**

After `minimumPublicCardCount`, add:

```js
const canonicalDemoUrl = "https://zomo-design.github.io/candlelit-relief-archive/";
const requiredPresentationAssets = [
  "docs/images/candlelit-relief-archive-preview.webp",
];
```

After validating `requiredRootAssets`, add:

```js
for (const file of requiredPresentationAssets) await requireFile(file);
```

After reading `ASSET_LICENSE.md`, read the README and require its exact public presentation fragments:

```js
const readme = await readFile(path.join(root, "README.md"), "utf8");
for (const fragment of [
  canonicalDemoUrl,
  "docs/images/candlelit-relief-archive-preview.webp",
  "▶ Open Live Demo",
]) {
  if (!readme.includes(fragment)) {
    throw new Error(`README.md is missing required Demo fragment: ${fragment}`);
  }
}
```

Add the reviewed URL to `allowedUrlPrefixes`:

```js
const allowedUrlPrefixes = [
  canonicalDemoUrl,
  "http://127.0.0.1:",
  "http://www.w3.org/2000/svg",
];
```

- [ ] **Step 3: Verify the new contract fails because the preview does not exist yet**

Run:

```bash
node scripts/validate.mjs
```

Expected: non-zero exit referring to the missing `docs/images/candlelit-relief-archive-preview.webp`.

- [ ] **Step 4: Verify the source image and compression preferences**

Run:

```bash
: "${PREVIEW_SOURCE:?Set PREVIEW_SOURCE to the supplied PNG outside the repository}"
test -f "$PREVIEW_SOURCE"
sips -g format -g pixelWidth -g pixelHeight "$PREVIEW_SOURCE"
test -f .baoyu-skills/baoyu-compress-image/EXTEND.md && \
  sed -n '1,200p' .baoyu-skills/baoyu-compress-image/EXTEND.md || true
test -f "${HOME}/.baoyu-skills/baoyu-compress-image/EXTEND.md" && \
  sed -n '1,200p' "${HOME}/.baoyu-skills/baoyu-compress-image/EXTEND.md" || true
```

Expected: the source reports PNG and `1280 × 1280`; the preference commands either print a configuration or no output.

- [ ] **Step 5: Compress the approved source to the repository asset path**

Resolve the filesystem directory containing the `baoyu-compress-image` skill as `BAOYU_COMPRESS_SKILL`, then run:

```bash
: "${BAOYU_COMPRESS_SKILL:?Set BAOYU_COMPRESS_SKILL to the skill directory}"
mkdir -p docs/images
npx -y bun "$BAOYU_COMPRESS_SKILL/scripts/main.ts" "$PREVIEW_SOURCE" \
  --output docs/images/candlelit-relief-archive-preview.webp \
  --format webp --quality 84 --keep --json
```

Expected: the source PNG remains present and the new WebP is created.

Verify dimensions and size reduction:

```bash
sips -g format -g pixelWidth -g pixelHeight \
  docs/images/candlelit-relief-archive-preview.webp
source_bytes=$(stat -f %z "$PREVIEW_SOURCE")
preview_bytes=$(stat -f %z docs/images/candlelit-relief-archive-preview.webp)
test "$preview_bytes" -lt "$source_bytes"
printf 'source=%s preview=%s\n' "$source_bytes" "$preview_bytes"
```

Expected: WebP, `1280 × 1280`, and `preview` is smaller than `source`.

- [ ] **Step 6: Add the centered hero and Demo entrance to README**

Immediately after the opening description and before `## Features`, add exactly:

```html
<p align="center">
  <a href="https://zomo-design.github.io/candlelit-relief-archive/">
    <img src="docs/images/candlelit-relief-archive-preview.webp"
         alt="Candlelit Relief Archive interactive ten-card gallery preview"
         width="960">
  </a>
</p>

<p align="center">
  <a href="https://zomo-design.github.io/candlelit-relief-archive/"><strong>▶ Open Live Demo</strong></a>
</p>
```

Do not alter the Features, local-run, configuration, privacy, or license sections except where required by later steps.

- [ ] **Step 7: Add the preview to the rights-reserved asset boundary**

In `ASSET_LICENSE.md`, extend the sentence enumerating protected root assets so it also names:

```markdown
`docs/images/candlelit-relief-archive-preview.webp`
```

In `ASSETS.md`, add a `README presentation` subsection with:

```markdown
## README presentation

- `docs/images/candlelit-relief-archive-preview.webp`
```

The existing statement that listed visual assets are governed by `ASSET_LICENSE.md`, not MIT, remains unchanged.

- [ ] **Step 8: Run the complete local contract and inspect the presentation diff**

Run:

```bash
node scripts/validate.mjs
node --check scripts/validate.mjs
bash -n start-gallery.sh
xmllint --noout card-back-logo.svg
git diff --check
git diff -- README.md ASSETS.md ASSET_LICENSE.md scripts/validate.mjs
git status --short
```

Expected: validator reports `10 card(s)`; all commands exit `0`; only the intended five paths plus the already committed design/plan files are in branch scope.

- [ ] **Step 9: Commit the README Demo presentation**

Run:

```bash
git add README.md ASSETS.md ASSET_LICENSE.md scripts/validate.mjs \
  docs/images/candlelit-relief-archive-preview.webp
git commit -m "docs: add live Demo preview"
```

Expected: one commit contains the optimized preview, README entrance, licensing updates, and validator contract.

---

### Task 2: Publish the README change through GitHub review

**Files:**
- No additional source changes unless the checks expose a defect.

**Interfaces:**
- Consumes: the validated `agent/add-pages-demo` branch.
- Produces: a reviewed and merged `main` containing the preview and Demo links.

- [ ] **Step 1: Run the final branch release gate**

Run:

```bash
node scripts/validate.mjs
bash -n start-gallery.sh
git diff --check origin/main...HEAD
git status --short
git log --format='%an <%ae> | %cn <%ce>' origin/main..HEAD | sort -u
```

Expected: validation succeeds, the worktree is clean, and all new commits use the Zomo Design no-reply identity.

- [ ] **Step 2: Push and create a Draft Pull Request**

Run:

```bash
git push -u origin agent/add-pages-demo
```

Create a Draft PR targeting `main` titled `Add README preview and live Demo entrance`. Its body must cover the single-image design, canonical URL, mixed-license update, validator coverage, source preservation, compression evidence, and local checks.

- [ ] **Step 3: Inspect the PR and wait for GitHub Actions**

Verify the PR file list contains:

```text
README.md
ASSETS.md
ASSET_LICENSE.md
scripts/validate.mjs
docs/images/candlelit-relief-archive-preview.webp
```

Verify it contains no source PNG, machine path, second screenshot, GIF, or video. Wait for `Validate static gallery` to finish with `success` for the PR head SHA.

- [ ] **Step 4: Mark ready, squash merge, and update local main**

Run:

```bash
gh pr ready
gh pr merge --squash --delete-branch
git switch main
git pull --ff-only origin main
node scripts/validate.mjs
```

Expected: the PR is merged, `main` matches `origin/main`, and the validator reports ten cards.

---

### Task 3: Enable GitHub Pages and verify the public Demo

**Files:**
- No repository file changes.

**Interfaces:**
- Consumes: merged `main` and GitHub repository administration access.
- Produces: the canonical public Pages site and repository Website link.

- [ ] **Step 1: Confirm the merged source and current Pages state**

Run:

```bash
git status -sb
git rev-parse HEAD
git rev-parse origin/main
gh api repos/Zomo-Design/candlelit-relief-archive/pages
```

Expected before first enablement: clean synchronized `main`; the Pages request returns HTTP `404`.

- [ ] **Step 2: Enable Pages from the root of main**

For the expected `404` state, run:

```bash
printf '%s' '{"source":{"branch":"main","path":"/"}}' | \
  gh api --method POST repos/Zomo-Design/candlelit-relief-archive/pages --input -
```

If the site already exists instead, update its source:

```bash
printf '%s' '{"source":{"branch":"main","path":"/"}}' | \
  gh api --method PUT repos/Zomo-Design/candlelit-relief-archive/pages --input -
```

Expected: the response identifies `https://zomo-design.github.io/candlelit-relief-archive/` and source branch `main`, path `/`.

- [ ] **Step 3: Set the repository Website field**

Run:

```bash
gh repo edit Zomo-Design/candlelit-relief-archive \
  --homepage "https://zomo-design.github.io/candlelit-relief-archive/"
gh repo view Zomo-Design/candlelit-relief-archive --json homepageUrl --jq .homepageUrl
```

Expected: the printed value exactly matches the canonical Demo URL.

- [ ] **Step 4: Wait for the Pages build to complete**

Poll without changing source until:

```bash
gh api repos/Zomo-Design/candlelit-relief-archive/pages --jq \
  '{status,html_url,source}'
gh api repos/Zomo-Design/candlelit-relief-archive/pages/builds/latest --jq \
  '{status,commit,error}'
```

Expected: Pages status is `built`, latest build status is `built`, `html_url` is the canonical Demo URL, and `error.message` is absent or empty.

- [ ] **Step 5: Verify the public files over HTTPS**

Run:

```bash
demo_url=https://zomo-design.github.io/candlelit-relief-archive/
curl --fail --silent --show-error --location "$demo_url" | rg -q 'Candlelit Relief Archive'
curl --fail --silent --show-error --location "${demo_url}gallery-config.json" | \
  jq -e '.order | length == 10'
for file in card-back-logo.svg candle-sconce-loop.mp4 cat-portrait/card-original.webp; do
  curl --fail --silent --show-error --location --range 0-32 "${demo_url}${file}" >/dev/null
done
```

Expected: every request succeeds and the public gallery manifest contains ten cards.

- [ ] **Step 6: Verify the live browser experience**

Open the canonical URL at `1440 × 900` and assert:

```text
The page title is Candlelit Relief Archive.
Exactly 10 .gcard buttons are attached.
At least 3 differently positioned cards are visible.
The brand mark and sconce poster/video load.
Opening the center card shows the lightbox and a visible, non-zero WebGL canvas.
Pointer movement changes the opened card transform.
There are no console errors, page errors, or failed non-HEAD asset requests.
```

Capture one verification screenshot outside the repository.

- [ ] **Step 7: Verify the public GitHub landing page configuration**

Run:

```bash
gh repo view Zomo-Design/candlelit-relief-archive --json homepageUrl,url \
  --jq '{url,homepageUrl}'
gh api repos/Zomo-Design/candlelit-relief-archive/contents/README.md \
  -H 'Accept: application/vnd.github.raw+json' | \
  rg -c 'docs/images/candlelit-relief-archive-preview.webp|▶ Open Live Demo'
```

Expected: the Website is the canonical Demo URL and the README contains one preview path plus one Demo label.

- [ ] **Step 8: Run the final local and remote release gate**

Run:

```bash
node scripts/validate.mjs
git status -sb
test "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)"
gh run list --repo Zomo-Design/candlelit-relief-archive --branch main --limit 1 \
  --json status,conclusion,headSha,url
gh api repos/Zomo-Design/candlelit-relief-archive/pages --jq \
  '{status,html_url,source}'
```

Expected: local validation succeeds, the worktree is clean and synchronized, the latest `main` validation is successful, and Pages is built at the canonical URL.
