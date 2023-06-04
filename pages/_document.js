import Document, { Html, Head, Main, NextScript } from 'next/document'
class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className="scroll-smooth">
        <Head>
          <link rel="apple-touch-icon" sizes="76x76" href="/static/favicons/favicon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon.png" />
          <link rel="manifest" href="/static/favicons/site.webmanifest" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link
            href="https://fonts.googleapis.com/css2?family=Rubik:wght@700&display=swap"
            rel="stylesheet"
          />
          <meta name="msapplication-TileColor" content="#000000" />
          <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
          <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
        </Head>
        <body className="bg-white text-black antialiased dark:bg-gray-900 dark:text-white">
          <Main />
          <NextScript src="/src/purify.js" />
        </body>
      </Html>
    )
  }
}

export default MyDocument
