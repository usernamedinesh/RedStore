import Slider from "react-slick";
import "../../App.css";

// Import your feature product images
import productImg1 from "../../assets/product/nike-dunk-low-concord-1.jpg";
import productImg2 from "../../assets/product/shoe2.JPG";
import productImg3 from "../../assets/product/shoe4.png";
import productImg4 from "../../assets/product/shoe5.png";
import productImg5 from "../../assets/product/shoe6.png";
import productImg6 from "../../assets/product/shoe7.jpg";
import productImg7 from "../../assets/product/shoe8.png";
import productImg8 from "../../assets/product/shoe9.jpg";
import productImg9 from "../../assets/product/shoes1.png";

function FeatureProduct() {
  const productImages = [
    { id: 1, src: productImg1, alt: "Featured Product 1" },
    { id: 2, src: productImg2, alt: "Featured Product 2" },
    { id: 3, src: productImg3, alt: "Featured Product 3" },
    { id: 4, src: productImg4, alt: "Featured Product 4" },
    { id: 5, src: productImg5, alt: "Featured Product 5" },
    { id: 6, src: productImg6, alt: "Featured Product 6" },
    { id: 7, src: productImg7, alt: "Featured Product 7" },
    { id: 8, src: productImg8, alt: "Featured Product 8" },
    { id: 9, src: productImg9, alt: "Featured Product 9" },
  ];

  // Slider settings for your feature products
  return (
    <div className="my-10">
      <p>hi</p>
    </div>
  );
}

export default FeatureProduct;
