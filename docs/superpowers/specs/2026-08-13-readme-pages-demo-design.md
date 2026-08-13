# README Preview and GitHub Pages Demo Design

## Goal

Make the repository landing page immediately communicate the finished visual
result and provide a reliable one-click entrance to the live gallery.

## Selected presentation

Use one hero image rather than a multi-image gallery. The source is the
user-provided 1280×1280 PNG outside the repository, showing the complete
carousel composition with the cat card centered.

The README opening order will be:

1. `Candlelit Relief Archive` title.
2. Existing one-paragraph project description.
3. The centered hero preview, linked to the live demo.
4. A centered, clearly labeled `▶ Open Live Demo` link.
5. Existing technical documentation beginning with Features.

This keeps the repository useful to developers while making the finished work
visible before the setup instructions.

## Image handling

Create `docs/images/candlelit-relief-archive-preview.webp` from the supplied
PNG. Preserve the original composition and aspect ratio, use high visual
quality, and optimize file size for GitHub README loading. Do not modify or
delete the user's source file in Downloads.

The preview image is part of the Zomo Design visual presentation and must be
added to `ASSETS.md` and covered by `ASSET_LICENSE.md`, not the MIT License.

## Live demo hosting

Publish the repository root from the `main` branch with GitHub Pages. The
canonical demo URL is:

`https://zomo-design.github.io/candlelit-relief-archive/`

The existing static structure requires no build step: `index.html`, the ten
card directories, JSON configurations, and root media files are served as-is.
Existing same-origin relative asset paths must remain unchanged.

Set the repository homepage/Website field to the canonical demo URL so GitHub
also displays the Demo entry beside the repository description.

## Failure handling

- If Pages cannot be enabled through the API, preserve the README changes and
  report the exact GitHub setting the user must enable manually.
- If the Pages deployment fails, inspect the Actions deployment log before
  changing application code.
- The README must not advertise the Demo as verified until the public URL
  responds successfully and loads the ten-card gallery.

## Verification

Before publication:

- Confirm the compressed preview renders correctly and is materially smaller
  than the source PNG.
- Run `node scripts/validate.mjs`, `bash -n start-gallery.sh`, and
  `git diff --check`.
- Confirm the README contains one preview image and both the image and text
  link use the canonical Pages URL.
- Confirm the preview file is listed in the mixed-license documentation.

After publication:

- Confirm GitHub Pages reports a successful deployment from `main`.
- Open the public Demo URL and verify ten cards, the brand mark, sconce media,
  and interactive WebGL lightbox load without failed asset requests.
- Confirm the repository homepage field equals the Demo URL and the public
  README renders the hero preview and Demo entrance.

## Scope exclusions

- No redesign of the gallery itself.
- No second screenshot, animation, GIF, or video in the README.
- No custom domain or third-party hosting.
- No changes to the code/visual-asset licensing boundary.
