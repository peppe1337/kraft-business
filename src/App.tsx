import Hero from './components/Hero'
import About from './components/About'
// import Services from './components/Services'
import Contact from './components/Contact'

export default function App() {
  return (
    <main className="bg-black min-h-screen">
      <Hero />
      <About />
      {/* <Services /> */}
      <Contact />
    </main>
  )
}
