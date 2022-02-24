import '../styles/globals.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  // // // service worker
  // useEffect(() => {
  //   if("serviceWorker" in navigator) {
  //     window.addEventListener("load", function () {
  //      navigator.serviceWorker.register("/sw.js").then(
  //         function (registration) {
  //           console.log("Service Worker registration successful with scope: ", registration.scope);
  //         },
  //         function (err) {
  //           console.log("Service Worker registration failed: ", err);
  //         }
  //       );
  //     });
  //   }
  // }, [])

  const getLayout = Component.getLayout || ((page) => page)
  return getLayout(<Component {...pageProps} />)
}

export default MyApp
