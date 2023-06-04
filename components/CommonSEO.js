import Head from 'next/head'
import { useRouter } from 'next/router'
import siteMetadata from '@/data/siteMetadata'
import hygraph from '../hygraph'
import { gql } from 'graphql-request'

// const ALL_SEOS_QUERY = gql`
//   {
//     seos {
//       siteUrl
//       description
//       title
//       logoDark {
//         id
//         url
//       }
//       socialBanner {
//         id
//         url
//       }
//       logo {
//         id
//         url
//       }
//     }
//   }
// `

export default function CommonSEO({ title, description, socialBanner, siteURL, ogType }) {
  console.log('🚀 ~ file: CommonSEO.js:30 ~ CommonSEO ~ socialBanner:', socialBanner)
  const router = useRouter()
  //   const seosData = seos[0]
  //   const { title, description, socialBanner, siteURL } = seosData
  return (
    <Head>
      <title>{title}</title>
      <meta name="robots" content="follow, index" />
      <meta name="description" content={description} />
      <meta property="og:url" content={`${siteURL}${router.asPath}`} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title} />

      <meta property="og:image" content={socialBanner.url} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={siteMetadata.twitter} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={socialBanner.url} />
      <link rel="canonical" href={`${siteURL}${router.asPath}`} />
    </Head>
  )
}
