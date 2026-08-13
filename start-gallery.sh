#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if command -v python3 >/dev/null 2>&1; then
  PYTHON_BIN="$(command -v python3)"
elif command -v python >/dev/null 2>&1; then
  PYTHON_BIN="$(command -v python)"
else
  echo "Python 3 is required to start the local preview." >&2
  exit 1
fi

if ! "$PYTHON_BIN" -c 'import sys; raise SystemExit(sys.version_info < (3, 8))'; then
  echo "Python 3.8 or newer is required to start the local preview." >&2
  exit 1
fi

START_PORT="${PORT:-8174}"
if ! [[ "$START_PORT" =~ ^[0-9]+$ ]] || (( START_PORT < 1024 || START_PORT > 65535 )); then
  echo "PORT must be an integer between 1024 and 65535." >&2
  exit 1
fi

PORT="$("$PYTHON_BIN" - "$START_PORT" <<'PY'
import socket
import sys

start = int(sys.argv[1])
for port in range(start, min(start + 100, 65536)):
    with socket.socket() as sock:
        try:
            sock.bind(("127.0.0.1", port))
        except OSError:
            continue
        print(port)
        break
else:
    raise SystemExit("No free local port found.")
PY
)"

URL="http://127.0.0.1:${PORT}/"
echo "Candlelit Relief Archive: $URL"
echo "Press Ctrl+C to stop."

open_preview() {
  if command -v open >/dev/null 2>&1; then
    open "$URL"
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$URL"
  fi
}

if [[ "${NO_OPEN:-0}" != "1" ]]; then
  (sleep 1; open_preview) &
fi
exec "$PYTHON_BIN" -m http.server "$PORT" --bind 127.0.0.1
