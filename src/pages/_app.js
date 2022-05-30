import React, { useState, useEffect } from "react";
import Head from "next/head";
import App from "next/app";
import Script from "next/script";
import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import CreateReactAppEntryPoint from "../App";

import "../index.css";
import "../App.css";
import "../game.css";
import "../Blockly/BlocklyComponent.css";

function SafeHydrate({ children }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <div suppressHydrationWarning>
      {typeof window === "undefined" ? null : children}
    </div>
  );
}
const imageURLBase =
  "https://storage.googleapis.com/sandspiel-studio/creations/";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { id } = router.query;

  let ogImageSrc = "https://mywebsite.net/assets/opengraph/theogimage.jpg";
  if (id) {
    ogImageSrc = `${imageURLBase}${id}.png`;
  }
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Sandspiel Studio [BETA]</title>
        <meta property="og:image" content={ogImageSrc} />
      </Head>
      <SafeHydrate>
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          <CreateReactAppEntryPoint {...pageProps} />
        </SessionProvider>

        <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
        <noscript>
          {/* eslint-disable @next/next/no-img-element */}
          <img
            src="https://queue.simpleanalyticscdn.com/noscript.gif"
            alt=""
            referrerPolicy="no-referrer-when-downgrade"
          />
        </noscript>
      </SafeHydrate>
    </>
  );
}
// Note: Per the Next.js docs, using getInitialProps in _app.js disables the ability to perform automatic static optimization,
//  causing every page in your app to be server-side rendered.
MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

export default MyApp;
