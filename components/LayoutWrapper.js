import { useState, useEffect } from 'react'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Link from './Link'
import SectionContainer from './SectionContainer'
import Footer from './Footer'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import { useTheme } from 'next-themes'
import Image from './Image'
import axios from 'axios'

const LayoutWrapper = ({ children }) => {
  const { theme } = useTheme()
  const [logos, setLogos] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const logoObject = await axios.get('/api/getLogos')
        setLogos(logoObject)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  return (
    <SectionContainer>
      <div className="flex h-screen flex-col justify-between">
        <header className="flex items-center justify-between py-10">
          <div>
            <Link href="/" aria-label={siteMetadata.title}>
              <div className="flex items-center">
                <Image
                  src={theme === 'dark' ? logos.logoLight : logos.logoDark}
                  alt="Very Local Weather"
                  width={434}
                  height={84}
                />
                <h3 className="logo-added ml-10">Nashville Weather</h3>
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
