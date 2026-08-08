# Relief Light Gallery

A dependency-free WebGL2 gallery for interactive relief cards. Move the pointer across a card to steer a warm light source; normal, height, and roughness maps control the apparent surface direction, depth, and highlights.

The public repository contains original geometric demo textures only. The private exhibition artwork and brand assets are not included.

## Features

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

Set `NO_OPEN=1` to start the server without opening a browser, or set `PORT=9000` to choose the first port to try.

Or start a server manually:

```bash
python3 -m http.server 8174 --bind 127.0.0.1
```

Then open <http://127.0.0.1:8174/>. Opening `index.html` through `file://` will not work because browsers block local WebGL texture requests.

## Add a card

Create a folder such as `my-card/` containing:

```text
my-card/
  card-config.json
  card-original.webp
  card-normal.webp
  card-height.webp
  card-roughness.webp
```

Copy `demo-card/card-config.json`, update the asset filenames and metadata, then add `"my-card"` to `gallery-config.json` → `order`.

Map meanings:

- Height map: lighter values appear higher; darker values appear lower.
- Normal map: RGB values encode which direction each surface faces.
- Roughness map: darker values produce sharper highlights; lighter values look more matte.

## Configuration

`gallery-config.json` controls the exhibition and carousel. Each card's `card-config.json` controls lighting, parallax, tilt, rendering, and asset paths.

All asset paths are same-origin relative paths. Do not place secrets or private URLs in configuration files.

Validate the repository before publishing changes:

```bash
node scripts/validate.mjs
```

## Browser support

Recent versions of Chrome, Edge, Firefox, and Safari with WebGL2 enabled are recommended. If WebGL2 or a texture fails, the original image remains visible and the page shows a fallback notice.

## Privacy and network behavior

The included code does not use analytics, cookies, storage, tracking, uploads, or third-party network requests. The local launcher listens only on `127.0.0.1`.

## License

Code and included demo assets are available under the [MIT License](LICENSE). See [ASSETS.md](ASSETS.md) before adding or redistributing artwork.
