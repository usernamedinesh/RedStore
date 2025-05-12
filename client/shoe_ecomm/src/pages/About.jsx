import NavBar from "../components/navBar"
import Footer from "../components/footer"

import '../styles/home.css'


import AboutContent from "../components/about/aboutContent.jsx"

export default function About() {
  return (
    <div>
      <div className="gradient">
        <NavBar />
        <AboutContent />
      </div>
      <Footer />
    </div>
  )
}
