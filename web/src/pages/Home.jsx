import Header from '../components/common/Header'
import Footer from '../components/common/Footer'
import Hero from '../components/home/Hero'
import Features from '../components/home/Features'
import HowItWorks from '../components/home/HowItWorks'
import Stats from '../components/home/Stats'
import Modules from '../components/home/Modules'
import Destinations from '../components/home/Destinations'
import Testimonials from '../components/home/Testimonials'
import Partners from '../components/home/Partners'
import CTA from '../components/home/CTA'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Features />
        <Modules />
        <HowItWorks />
        <Destinations />
        <Testimonials />
        <Partners />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
