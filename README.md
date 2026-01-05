# nomuman.github.io

## Local preview (Python3)

1. Build

```
node build.mjs
```

2. Serve `dist`

```
cd dist
python3 -m http.server 8000
```

Open http://localhost:8000/

### Optional: local OGP/hreflang URLs

If you want local URLs in meta tags, rebuild with:

```
SITE_ORIGIN=http://localhost:8000 node build.mjs
```
