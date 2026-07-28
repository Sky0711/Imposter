# Imposter

Pass-and-play party game. Everyone gets the same secret word — someone doesn't.
Talk your way through it and find out who.

Croatian and English word lists, 3–16 players, optional round timer, and an
imposter count that can be rolled in secret (could be nobody, could be all of you).

## Running it

It is a static site — no build step, no dependencies.

```sh
python3 -m http.server 8080
```

Then open <http://localhost:8080>. A plain `file://` open works too, but the
service worker (and so offline play) only runs over `http://localhost` or HTTPS.

## Installing on a phone

Open the deployed URL, then:

- **iPhone** — Safari → Share → *Add to Home Screen*
- **Android** — Chrome → ⋮ → *Install app* / *Add to Home screen*

It launches fullscreen with no browser chrome, and works offline after the
first load.

## Files

| File | |
| --- | --- |
| `index.html` | the whole game — markup, styles, logic, word lists |
| `manifest.webmanifest` | name, icons, theme colour, standalone display |
| `sw.js` | service worker; offline cache |
| `icons/` | app icons (`maskable-512` is the one Android crops) |

## Changing the word lists

Words live in the `WORDS` object in `index.html`, as `"Word|the clue"` pairs,
one block per language and category. Add a category by adding an entry to
`CATS` and a matching key under **both** `en` and `hr`.

## Deploying

Pushing to the default branch publishes via GitHub Pages. After a change,
bump `CACHE` in `sw.js` (`imposter-v1` → `imposter-v2`) so installed phones
pick up the new version instead of serving the old cache.
