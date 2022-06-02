import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="theme-color" content="#000000" />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body>
          <Main />
          <div id="fps"></div>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
