import Document, {
    Html, Head, Main, NextScript,
  } from 'next/document';
  
  export default class MyDocument extends Document {
    render() {
      return (
        <Html lang="ru">
          <Head>
            {/* <link rel="icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" href="/logo192.png" />
      <link rel="manifest" href="/manifest.json" /> */}
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
            <meta name="robots" content="index, follow" />
            <script src="/js/highcharts.js" />
            <script src="/js/highcharts-3d.js" />
          </Head>
          <body className="bg-gray-900 text-white">
            <Main />
            <NextScript />
          </body>
        </Html>
      );
    }
  }
  