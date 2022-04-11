const makeServiceWorkerEnv = require('service-worker-mock');
// const makeFetchMock = require('service-worker-mock/fetch'); 
require('cross-fetch/polyfill');
 
describe('Service worker', () => {
  beforeEach(() => {
    const serviceWorkerEnv = makeServiceWorkerEnv();
    Object.defineProperty(serviceWorkerEnv, 'addEventListener', {
      value: serviceWorkerEnv.addEventListener,
      enumerable: true
    });
    Object.assign(global, serviceWorkerEnv)
    // const fetchMock = makeFetchMock();
    // Object.assign(global, fetchMock);
    jest.resetModules();
  });

  it('should add listeners', async () => {
    require('../public/swCacheSite-indexedDB.js');
    await self.trigger('install');
    expect(self.listeners.get('install')).toBeDefined();
    expect(self.listeners.get('activate')).toBeDefined();
    expect(self.listeners.get('fetch')).toBeDefined();
  });

  it('should delete old caches on activate', async () => {
    require('../public/swCacheSite-indexedDB.js');
  
    // Create old cache
    await self.caches.open('cacheName');
    expect(self.snapshot().caches.cacheName).toBeDefined();
  
    // Activate and verify old cache is removed
    await self.trigger('activate');
    expect(self.snapshot().caches.cacheName).toStrictEqual(undefined);
  });

  it('should return a cached response', async () => {
    require('../public/swCacheSite-indexedDB.js');
    
    const cachedResponse = { clone: () => { }, data: { key: 'value' } };
    const cachedRequest = new Request('/test');
    const cache = await self.caches.open('TEST');
    cache.put(cachedRequest, cachedResponse);
  
    const response = await self.trigger('fetch', cachedRequest);
    expect(response.data.key).toEqual('value');
  });

  it('should fetch and cache an uncached request', async () => {
    const mockResponse = { clone: () => { return { data: { key: 'value' } } } };
    global.fetch = (response) => Promise.resolve({ ...mockResponse, headers: response.headers });
  
    require('../public/swCacheSite-indexedDB.js');
  
    const request = new Request('/test');
    const response = await self.trigger('fetch', request);
    expect(response.clone()).toEqual(mockResponse.clone());
  
    const runtimeCache = self.snapshot().caches['my-site-cache-v3'];
    expect(runtimeCache[request.url]).toEqual(mockResponse.clone());
  });
  

});
