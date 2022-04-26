import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charset="utf-8" />
          <link rel="shortcut icon" href="favicon.ico" />
          <meta name="theme-color" content="#000000" />
          <link rel="manifest" href="manifest.json" />
        </Head>
        <body>
          <Main />

          <div id="root"></div>
          <div id="fps"></div>
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
