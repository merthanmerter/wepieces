import { defineConfig } from 'tsup'

export default defineConfig({
	format: ['cjs', 'esm'],
	outDir: 'core',
	entryPoints: ['src/index.ts'],
	dts: true,
	sourcemap: true,
	clean: true,
	minify: true,
	splitting: true,
	shims: true,
	skipNodeModulesBundle: true,
})
