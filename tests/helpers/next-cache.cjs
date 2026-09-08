// Exercise the installed Next.js 14 cache implementation in an isolated directory.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
global.AsyncLocalStorage ??= require('node:async_hooks').AsyncLocalStorage;
const { IncrementalCache } = require('next/dist/server/lib/incremental-cache');
const { staticGenerationAsyncStorage } = require('next/dist/client/components/static-generation-async-storage.external');
const cacheApi = require('next/cache');
module.exports = function createTestCache() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-cache-test-'));
  const incrementalCache = new IncrementalCache({
    dev: false, appDir: true, flushToDisk: true, serverDistDir: path.join(directory, 'server'),
    requestHeaders: {}, requestProtocol: 'http', maxMemoryCacheSize: 0,
    fs: { readFile: fs.promises.readFile, readFileSync: fs.readFileSync, writeFile: fs.promises.writeFile, mkdir: (dir) => fs.promises.mkdir(dir, { recursive: true }), stat: fs.promises.stat },
    getPrerenderManifest: () => ({ version: 4, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: { previewModeId: 'cache-test' } }),
    experimental: {},
  });
  const writes = [];
  const originalSet = incrementalCache.set.bind(incrementalCache);
  incrementalCache.set = (...args) => { const writing = originalSet(...args); writes.push(writing); return writing; };
  return {
    api: cacheApi,
    async run(callback) {
      const store = { incrementalCache, pagePath: '/', urlPathname: '/', isStaticGeneration: false };
      const value = await staticGenerationAsyncStorage.run(store, callback);
      await Promise.all(Object.values(store.pendingRevalidates || {}));
      await Promise.all(writes.splice(0));
      return value;
    },
    cleanup() { fs.rmSync(directory, { recursive: true, force: true }); },
  };
};
