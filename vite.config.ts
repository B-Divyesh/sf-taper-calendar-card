import { defineConfig, type Plugin } from 'vite';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
function precache(): Plugin { return { name: 'stepdown-precache', closeBundle() { const assets = readdirSync(join(process.cwd(), 'dist/assets')).map(name => `/assets/${name}`); const file = join(process.cwd(), 'dist/sw.js'); const sw = readFileSync(file, 'utf8').replace("'__ASSETS__'", JSON.stringify(assets)); writeFileSync(file, sw); } }; }
export default defineConfig({ build: { target: 'es2022' }, plugins: [precache()], test: { include: ['src/**/*.test.ts'] } });
