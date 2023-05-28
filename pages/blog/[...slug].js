import Link from '@/components/Link'
import formatDate from '@/lib/utils/formatDate'
import { GraphQLClient, gql } from 'graphql-request'
import { YoutubeContainer } from '../index'
import DOMPurify from 'isomorphic-dompurify'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import hygraph from '../../hygraph'

const ALLPOSTSQUERY = gql`
  query AllPosts {
    posts {
      slug
    }
  }
`

export async function getStaticPaths() {
  const { posts } = await hygraph.request(ALLPOSTSQUERY)

  let routes = posts.map((p) => {
    const params = `/blog/${p.slug}`
    return params
  })

  return { paths: routes, fallback: false }
}

const POSTQUERY = gql`
  query OneBlog($slug: String!) {
    posts(where: { slug: $slug }) {
      author {
        name
      }
      date
      title
      youTubeUrl
      id
      content {
        html
      }
    }
  }
`
export async function getStaticProps({ params }) {
  const hygraph = new GraphQLClient(
    'https://api-us-east-1-shared-usea1-02.hygraph.com/v2/clf8fl33302ow01umha9250xr/master'
  )
  const { posts } = await hygraph.request(POSTQUERY, { slug: params.slug[0] })

  return { props: { post: posts[0] } }
}

export default function Blog({ post }) {
  const { slug, date, title, tags, youTubeUrl, content } = post
  DOMPurify.addHook('afterSanitizeAttributes', function (node) {
    if (node.nodeName.toLowerCase() === 'a') {
      node.setAttribute('target', '_blank')
    }
  })

  return (
    <>
      <PageSEO
        title={title}
        description={content.html}
        url={`${siteMetadata.siteUrl}/blog/${slug}`}
      />
      <article>
        <div className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
          <dl>
            <dt className="sr-only">Published on</dt>
            <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
              <time dateTime={date}>{formatDate(date)}</time>
            </dd>
          </dl>
          <div className="space-y-5 xl:col-span-3">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold leading-8 tracking-tight">
                  <Link href={`/blog/${slug}`} className="text-gray-900 dark:text-gray-100">
                    {title}
                  </Link>
                </h2>
                <div className="my-10">
                  <YoutubeContainer>
                    <iframe
                      id="ytplayer"
                      type="text/html"
                      width="640"
                      height="360"
                      src={youTubeUrl}
                    ></iframe>
                  </YoutubeContainer>
                </div>
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content.html) }} />
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
