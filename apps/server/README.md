# app

To install dependencies:

```bash
bun install
```

scripts:

```bash
"start": "bun index.ts",
"dev": "bun --watch index.ts",
"exe": "bun build --compile --target=bun-windows-x64 ./index.ts --outfile server",
"studio": "bunx drizzle-kit studio",
"prod": "bun build --compile --minify --sourcemap ./index.ts --outfile server"
```
