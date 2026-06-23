# DashVegas.com premium CSS/JS landing

Static animated landing page. No build tools required.

## Files

- `index.html`
- `style.css`
- `script.js`
- `assets/`

## Quick use

Open `index.html` in a browser.

## Add your own transparent logo

1. Place the file here:

```txt
assets/logo.png
```

2. In `index.html`, find:

```html
<img class="logo-image is-hidden" src="./assets/logo.png" alt="DashVegas logo" />
```

3. Remove `is-hidden`:

```html
<img class="logo-image" src="./assets/logo.png" alt="DashVegas logo" />
```

4. If you use the image logo, you can remove or keep the text fallback below it.

## Publish with GitHub + Netlify

1. Create a GitHub repository.
2. Upload these files.
3. In Netlify: Add new site → Import from GitHub.
4. Build command: leave empty.
5. Publish directory: `/` or root.
6. Add your custom domain in Domain settings.

## Edit contact link

Current CTA:

```txt
hello@namingvault.com
```

Search that address in `index.html` and replace it if needed.
