import Head from "next/head"

export default function SEOHead({
  title = "Ujjain Travel - Sacred City Explorer",
  description = "Explore the sacred city of Ujjain with our comprehensive travel services. Book cars, hotels, and discover holy temples with expert guidance.",
  keywords = "ujjain travel, mahakaleshwar temple, ujjain hotels, car rental ujjain, ujjain tourism, kumbh mela, jyotirlinga, madhya pradesh travel",
  image = "/placeholder.svg?height=630&width=1200",
  url = "https://ujjaintravel.com",
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Ujjain Travel" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Ujjain Travel" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* PWA */}
      <meta name="theme-color" content="#f97316" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Ujjain Travel" />

      <link rel="canonical" href={url} />
      <link rel="manifest" href="/manifest.json" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/placeholder.svg?height=180&width=180" />
    </Head>
  )
}
