import React, { useState, useEffect } from "react";
import CreateReactAppEntryPoint from "../App";
import Head from "next/head";

import "../App.css";
import "../game.css";
import "../Blockly/BlocklyComponent.css";

function SafeHydrate({ children }) {
  return (
    <div suppressHydrationWarning>
      {typeof window === "undefined" ? null : children}
    </div>
  );
}

function App({ pageProps }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <SafeHydrate>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>SandBlocks</title>
      </Head>
      <CreateReactAppEntryPoint {...pageProps} />
    </SafeHydrate>
  );
}

export default App;
