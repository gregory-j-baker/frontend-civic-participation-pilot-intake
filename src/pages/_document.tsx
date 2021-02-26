import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/wet-boew/css/wet-boew.min.css" />
          <link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/wet-boew/css/theme.min.css" />
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossOrigin="anonymous" />
        </Head>
        <body vocab="http://schema.org/" typeof="WebPage">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
