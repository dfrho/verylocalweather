import Link from '@/components/Link'
import { PageSEO } from '@/components/SEO'
import formatDate from '@/lib/utils/formatDate'
import styled from 'styled-components'
import sortByDate from '../lib/sortByDate'
import { gql } from 'graphql-request'
import hygraph from '../hygraph'

const ALL_POSTS_SEOS_QUERY = gql`
  {
    posts {
      slug
      tags
      title
      youTubeUrl
      date
      excerpt
      description
    }
    seos {
      siteUrl
      description
      title
      logoDark {
        id
        url
      }
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
export const YoutubeContainer = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  max-width: 100%; /* ensure the container doesn't overflow on smaller screens */

  & iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    max-width: 100%; /* ensure the video maintains its aspect ratio on larger screens */

    /* adjust the width and height for smaller screens */
    @media (max-width: 767px) {
      width: 100%;
      height: 100%;
    }
  }
`
const MAX_DISPLAY = 5

export async function getStaticProps() {
  const { posts, seos } = await hygraph.request(ALL_POSTS_SEOS_QUERY)
  const seosData = seos[0]
  const sortedPosts = sortByDate(posts)
  return { props: { seosData, posts: sortedPosts } }
}

export default function Home({ posts, seosData }) {
  const { description, title, socialBanner } = seosData
  console.log('🚀 ~ file: index.js:72 ~ Home ~ socialBanner:', socialBanner)
  return (
    <>
      <PageSEO
        title={title}
        description={description}
        socialBanner={socialBanner}
        ogType="website"
      />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((postObject) => {
            const { slug, date, title, excerpt, youTubeUrl } = postObject

            return (
              <li key={slug} className="py-12">
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
                            <Link
                              href={`/blog/${slug}`}
                              className="text-gray-900 dark:text-gray-100"
                            >
                              {title}
                            </Link>
                          </h2>
                          <YoutubeContainer>
                            <iframe
                              id="ytplayer"
                              type="text/html"
                              width="640"
                              height="360"
                              src={youTubeUrl}
                              allowFullScreen
                            ></iframe>
                          </YoutubeContainer>
                        </div>
                        <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                          {excerpt}
                        </div>
                      </div>
                      <div className="text-base font-medium leading-6">
                        <Link
                          href={`/blog/${slug}`}
                          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                          aria-label={`Read "${title}"`}
                        >
                          Read more &rarr;
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="all posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
    </>
  )
}
