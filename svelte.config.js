import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-auto';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const packageDotJsonFile = fileURLToPath(new URL('package.json', import.meta.url));
const packageDotJsonFileContent = readFileSync(packageDotJsonFile, 'utf8');
const packageDotJson = JSON.parse(packageDotJsonFileContent);

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
        version: {
            name: packageDotJson.version,
        },
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter()
	},

	preprocess: [
		preprocess({
			postcss: true
		})
	]
};

export default config;
