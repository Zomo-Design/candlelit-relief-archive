# Candlelit Relief Archive

A dependency-free WebGL2 exhibition of ten interactive relief cards by Zomo
Design. Move the pointer across a card to steer a warm light source; normal,
height, and roughness maps control the apparent surface direction, depth, and
highlights.

## Features

- Ten real relief cards in a continuous, mixed-size carousel
- One HTML file and no external JavaScript or CSS dependencies
- WebGL2 normal, height, and roughness-map lighting
- CSS 3D tilt, parallax, warm rim light, and pointer-following highlights
- Drag, wheel, keyboard, and touch navigation
- Reduced-motion support and a static-image fallback
- Per-card JSON configuration

## Run locally

macOS or Linux:

```bash
chmod +x start-gallery.sh
./start-gallery.sh
```

Set `NO_OPEN=1` to start the server without opening a browser, or set
`PORT=9000` to choose the first port to try.

Or start a server manually:

```bash
python3 -m http.server 8174 --bind 127.0.0.1
```

Then open <http://127.0.0.1:8174/>. Opening `index.html` through `file://`
will not work because browsers block local WebGL texture requests.

## Use your own card

Create a folder such as `my-card/` containing a configuration file and four
images:

```text
my-card/
  card-config.json
  card-original.webp
  card-normal.webp
  card-height.webp
  card-roughness.webp
```

Use one of the existing `card-config.json` files as a structural reference,
point its `assets` fields at your own files, update the metadata, and add
`"my-card"` to `gallery-config.json` → `order`. Do not copy or redistribute the
included Zomo Design artwork when creating another project.

Map meanings:

- Height map: lighter values appear higher; darker values appear lower.
- Normal map: RGB values encode which direction each surface faces.
- Roughness map: darker values produce sharper highlights; lighter values look
  more matte.

## Configuration

`gallery-config.json` controls the exhibition and carousel. Each card's
`card-config.json` controls lighting, parallax, tilt, rendering, and relative
asset paths.

Do not place secrets, machine-specific paths, or private URLs in configuration
files. Validate the repository before publishing changes:

```bash
node scripts/validate.mjs
```

## Browser support

Recent versions of Chrome, Edge, Firefox, and Safari with WebGL2 enabled are
recommended. If WebGL2 or a texture fails, the original image remains visible
and the page shows a fallback notice.

## Privacy and network behavior

The included code does not use analytics, cookies, storage, tracking, uploads,
or third-party network requests. The local launcher listens only on
`127.0.0.1`.

## License

The software code is available under the [MIT License](LICENSE).

The included card artwork, texture maps, brand mark, cursor, and sconce media
are © Zomo Design and are not covered by MIT. See
[ASSET_LICENSE.md](ASSET_LICENSE.md) and [ASSETS.md](ASSETS.md).
