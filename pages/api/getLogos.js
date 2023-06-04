import { gql } from 'graphql-request'
import hygraph from '../../hygraph'

async function handler(req, res) {
  const ALL_SEOS_QUERY = gql`
    {
      seos {
        logoDark {
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

  return { logo: { logoLight: seosData.logo.url, logoDark: seosData.logo_dark.url } }
}

export default handler
