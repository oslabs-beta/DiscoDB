import '../styles/globals.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  // // // service worker
  useEffect(() => {
    if("serviceWorker" in navigator && 'SyncManager' in window) {
      window.addEventListener("load", function () {
       navigator.serviceWorker.register("../swCacheSite-indexedDB.js", {type: 'module', scope: '/'}).then(
          function (registration) {
            console.log("Service Worker registration successful with scope: ", registration.scope);
          },
          function (err) {
            console.log("Service Worker registration failed: ", err);
          }
        );
        // navigator.serviceWorker.ready.then(function(swRegistration) {
        //   console.log('successfully requested a one time sync')
        //   return swRegistration.sync.register('myFirstSync');
        // });
      });
    }
  }, [])

  

  const getLayout = Component.getLayout || ((page) => page)
  return getLayout(<Component {...pageProps} />)
}

export default MyApp
