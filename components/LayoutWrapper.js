import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import SectionContainer from './SectionContainer'
import Footer from './Footer'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import { useTheme } from 'next-themes'
import Image from './Image'

const LayoutWrapper = ({ children }) => {
  const { theme } = useTheme()

  return (
    <SectionContainer>
      <div className="flex h-screen flex-col justify-between">
        <header className="flex items-center justify-between pt-10">
          <div>
            <Link href="/" aria-label={siteMetadata.title}>
              <div className="flex items-center">
                <Image
                  src={
                    theme === 'dark'
                      ? '/static/images/very-local-logo-dark.png'
                      : '/static/images/very-local-logo-light.png'
                  }
                  alt="Very Local Weather"
                  width={434}
                  height={84}
                />
                <p className="font-rubik ml-6 pt-4 text-lg font-bold md:pt-5 md:text-2xl">
                  {siteMetadata.headerTitle}
                </p>
              </div>
            </Link>
          </div>
          <div className="flex items-center text-base leading-5">
            <div className="hidden sm:block">
              {headerNavLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="p-1 font-medium text-gray-900 dark:text-gray-100 sm:p-4"
                >
                  {link.title}
                </Link>
              ))}
            </div>
            <ThemeSwitch />
            <MobileNav />
          </div>
        </header>
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  )
}

export default LayoutWrapper
