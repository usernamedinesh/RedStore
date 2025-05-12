
function ContactForm() {
  return (
    <div className="mx-96 py-20 justify-center">
      <div className="mb-9 grid grid-cols-2 gap-7">
        <div className="">
          <form className="" action="">
            <input className="mb-7 w-full px-6 py-3 border border-[#ff523b] rounded-md outline-none" type="text" placeholder="Enter Your Name" />
            <input className="mb-7 w-full px-6 py-3 border border-[#ff523b] rounded-md outline-none" type="text" placeholder="Enter Your Email" />
            <textarea className="mb-7 w-full px-6 py-3 border border-[#ff523b] rounded-md outline-none" name="message" cols="30" rows="10" placeholder="Enter your message" />
            <button className="px-5 py-2 text-[#ff523b] hover:text-white font-medium bg-white border hover:bg-[#ff523b] border-[#ff523b] rounded-md outline-none transition-all duration-300" type="submit">Send</button>
          </form>
        </div>
        <div>
          <p className="mb-7 text-sm text-gray-600">A cheerful welcome to the RedStore contact hub! We&lsquo;re thrilled that you&lsquo;ve chosen to connect with us. At RedStore, we believe in creating a community where your questions, feedback, and inquiries are not just heard but valued.</p>
          <p className="mb-7 text-sm text-gray-600">A cheerful welcome to the RedStore contact hub! We&lsquo;re thrilled that you&lsquo;ve chosen to connect with us. At RedStore, we believe in creating a community where your questions, feedback, and inquiries are not just heard but valued.</p>
          <p className="mb-7 text-sm text-gray-600">Whether you&lsquo;re seeking style advice, tracking an order, or just want to share your thoughts, our team is here and ready to assist you. Your satisfaction is our top priority, and we&lsquo;re dedicated to making your experience with RedStore as enjoyable and seamless as possible.</p>
          <p className="mb-7 text-sm text-gray-600">Feel free to drop us a line using the contact form below, shoot us an email, or give us a ring. We can&lsquo;t wait to engage with you and make your RedStore journey exceptional.</p>
        </div>
      </div>
      <p className="mb-7 text-sm text-center text-gray-600">Thank you for choosing RedStore - where your fashion desires meet unparalleled service.</p>
    </div>
  )
}

export default ContactForm