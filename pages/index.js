import Link from '@/components/Link'
import { useTheme } from 'next-themes'
import { PageSEO } from '@/components/SEO'
import siteMetadata from '@/data/siteMetadata'
import formatDate from '@/lib/utils/formatDate'
import { gql } from 'graphql-request'
import styled from 'styled-components'
import sortByDate from '../lib/sortByDate'
import hygraph from '../hygraph'
import Image from 'components/Image'

const QUERY = gql`
  {
    posts {
      slug
      tags
      title
      youTubeUrl
      date
      excerpt
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
  const { posts } = await hygraph.request(QUERY)
  const sortedPosts = sortByDate(posts)
  return { props: { posts: sortedPosts } }
}

export default function Home({ posts }) {
  const { theme } = useTheme()
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <div className="flex items-center">
            <Image
              src={
                theme === 'dark'
                  ? '/static/images/very-local-logo.webp'
                  : '/static/images/very-local-logo-light.png'
              }
              alt="Very Local Weather"
              width={434}
              height={84}
            />
            <h1 className="ml-10 text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
              Nashville
            </h1>
          </div>

          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {siteMetadata.description}
          </p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((frontMatter) => {
            const { slug, date, title, excerpt, youTubeUrl } = frontMatter

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
