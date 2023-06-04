import { gql } from 'graphql-request'
import hygraph from '../../hygraph'

async function handler(req, res) {
  const ALL_SEOS_QUERY = gql`
    {
      seos {
        socialBanner {
          id
          url
        }
        logo {
          id
          url
        }
      }
    }
  `
  // fetch data when component mounts

  const { seos } = await hygraph.request(ALL_SEOS_QUERY)
  const seosData = seos[0]
  console.log('🚀 ~ file: LayoutWrapper.js:44 ~ fetchData ~ seosData:', seosData)

  return { logo: { logoLight: seosData.logo.url, logoDark: seosData.logoDark.url } }
}

export default handler
