import Link from '@/components/Link'
import formatDate from '@/lib/utils/formatDate'
import { gql } from 'graphql-request'
import DOMPurify from 'isomorphic-dompurify'
import { PageSEO } from '@/components/SEO'
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
      excerpt
      content {
        html
      }
    }
    seos {
      siteUrl
      socialBanner {
        id
        url
      }
    }
  }
`
export async function getStaticProps({ params }) {
  const { posts, seos } = await hygraph.request(POSTQUERY, { slug: params.slug[0] })
  const seosData = seos[0]
  return { props: { post: posts[0], seosData } }
}

export default function BlogPost({ post, seosData }) {
  const { slug, date, title, youTubeUrl, content, excerpt } = post
  DOMPurify.addHook('afterSanitizeAttributes', function (node) {
    if (node.nodeName.toLowerCase() === 'a') {
      node.setAttribute('target', '_blank')
    }
  })

  return (
    <>
      <PageSEO
        socialBanner={seosData.socialBanner}
        ogType="article"
        title={title}
        description={excerpt}
        url={`${seosData.siteUrl}/blog/${slug}`}
      />
      <article>
        <div className="space-y-3 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
          <div className="space-y-5 xl:col-span-3">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold leading-8 tracking-tight">
                  <Link href={`/blog/${slug}`} className="text-gray-900 dark:text-gray-100">
                    {title}
                  </Link>
                </h2>
                <dl>
                  <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                    <time dateTime={date}>{formatDate(date)}</time>
                  </dd>
                </dl>
                <div className="my-10">
                  <div className="relative w-full max-w-full pt-[56.25%]">
                    <iframe
                      id="ytplayer"
                      type="text/html"
                      className="absolute top-0 left-0 h-full w-full max-w-full"
                      width="640"
                      height="360"
                      src={`${youTubeUrl}?controls=1`}
                      allowFullScreen
                    ></iframe>
                  </div>
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
