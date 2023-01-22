import { defineConfig } from 'tsup'

export default defineConfig(options => ({
	outDir: 'lib',
	minify: !options.watch,
}))
