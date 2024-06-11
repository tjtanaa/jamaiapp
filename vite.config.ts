import { defineConfig } from 'vite';
// import { svelte } from "@sveltejs/vite-plugin-svelte";

import 'dotenv/config';
import { sveltekit } from '@sveltejs/kit/vite';
import type { ProxyOptions, ViteDevServer } from 'vite';
import express from 'express';
import expressOpenIdConnect from 'express-openid-connect';
import { defineConfig } from 'vitest/config';

const proxy: Record<string, string | ProxyOptions> = {
	'/login': {},
	'/logout': {},
	'/callback': {},
	'/dev-profile': {}
};

function expressPlugin() {
	const app = express();
	if (process.env.PUBLIC_IS_LOCAL === 'false') {
		app.use(
			expressOpenIdConnect.auth({
				authRequired: false,
				auth0Logout: true,
				baseURL: `http://localhost:5173`,
				clientID: process.env.AUTH0_CLIENT_ID,
				issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
				secret: process.env.AUTH0_SECRET,
				routes: {
					login: false
				}
			})
		);
		app.get('/login', (req, res) => {
			res.oidc.login({
				returnTo: (typeof req.query.returnTo === 'string' ? req.query.returnTo : '/') || '/'
			});
		});
		app.get('/dev-profile', (req, res) => {
			res.json(req.oidc.user ?? {});
		});
	}

	return {
		name: 'express-plugin',
		config() {
			return {
				server: { proxy },
				preview: { proxy }
			};
		},
		configureServer(server: ViteDevServer) {
			server.middlewares.use(app);
		}
	};
}

export default defineConfig({
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // Tauri expects a fixed port, fail if that port is not available
  server: {
    strictPort: true,
  },
  // to access the Tauri environment variables set by the CLI with information about the current target
  envPrefix: ['VITE_', 'TAURI_PLATFORM', 'TAURI_ARCH', 'TAURI_FAMILY', 'TAURI_PLATFORM_VERSION', 'TAURI_PLATFORM_TYPE', 'TAURI_DEBUG'],
  build: {
    // Tauri uses Chromium on Windows and WebKit on macOS and Linux
    target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
  },
	optimizeDeps: {
		esbuildOptions: {
			target: 'esnext'
		}
	},
	plugins: [process.env.PUBLIC_IS_LOCAL === 'false' && expressPlugin(), sveltekit()],
  test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
})