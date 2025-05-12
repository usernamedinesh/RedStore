import NavBar from "../components/navBar"
import Footer from "../components/footer"
import ContactForm from "../components/contact/contactForm.jsx"

import '../styles/home.css'

export default function Contact() {
  return (
    <div>
      <div className="gradient">
        <NavBar />
        <ContactForm />
      </div>
      <Footer />
    </div>
  )
}
