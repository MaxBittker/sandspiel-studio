import React, { useState, useEffect } from "react";
import CreateReactAppEntryPoint from "../App";

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
      <CreateReactAppEntryPoint {...pageProps} />
    </SafeHydrate>
  );
}

export default App;
