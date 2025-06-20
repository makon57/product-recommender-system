import Slider from "react-slick";
import { faker } from "@faker-js/faker";
import { ProductCard } from "./productCard";

interface ProductData {
  id: number;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
}

function Responsive() {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  function createRandomProducts() {
    const myProduct: ProductData = {
      id: faker.number.int(),
      title: faker.book.title(),
      description: faker.lorem.lines(1),
      price: faker.finance.amount({ min: 5, max: 20, dec: 2, symbol: "$" }),
      imageUrl: faker.image.urlLoremFlickr(),
    };

    return myProduct;
  }

  const products = faker.helpers.multiple(createRandomProducts, {
    count: 10,
  });

  return (
    <div className="slider-container">
      <Slider {...settings}>
          {Object.values(products).map((product, index) => (
            <div className="cards-container" style={{ marginTop: "15px" }}>
              <ProductCard product={product} index={index} />
            </div>
          ))}
      </Slider>
    </div>
  );
}

export default Responsive;
