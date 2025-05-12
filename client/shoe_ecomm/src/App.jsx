import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'

import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import Product from './pages/Product.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Cart from './pages/Cart.jsx';
import Account from './pages/Account.jsx';

function App() {

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
