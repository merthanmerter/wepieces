import { defineConfig } from 'tsup'

export default defineConfig({
	format: ['cjs', 'esm'],
	entryPoints: ['src/index.ts', 'src/di.ts', 'src/utils.ts'],
	dts: true,
	sourcemap: true,
	clean: true,
	minify: true,
	splitting: true,
	shims: true,
	skipNodeModulesBundle: true,
})
