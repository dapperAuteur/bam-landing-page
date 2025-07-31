import Head from 'next/head'

interface ShareMetaTagsProps {
  title: string
  description: string
  image?: string
  url?: string
}

export default function ShareMetaTags({ 
  title, 
  description, 
  image = '/default-share-image.png',
  url 
}: ShareMetaTagsProps) {
  const fullUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

  return (
    <Head>
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Bluesky */}
      <meta property="bluesky:card" content="summary_large_image" />
    </Head>
  )
}