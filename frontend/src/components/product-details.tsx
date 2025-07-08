import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  FlexItem,
  Title,
} from "@patternfly/react-core";
import { SingleFakerProducts } from "./faker-products";
import ReactStars from "react-rating-stars-component"; // import { FakerProducts } from "./faker-products";
// import { fetchProduct } from "../services/products";
// import { useQuery } from "@tanstack/react-query";
// import { Route } from "../routes/product/$productId";

export function ProductDetails() {
  // const post = Route.useLoaderData()
  // const { productId } = Route.useParams();
  // const {
  //   data: productItem,
  //   error: productError,
  //   isLoading: isProductLoading,
  // } = useQuery({
  //   queryKey: ["product", productId], // A unique key for this query
  //   queryFn: async () => fetchProduct(productId), // The async function to fetch data
  // });

  //   const product = productItem ? productItem : FakerProducts(1);

  const product = SingleFakerProducts();
  const handleAddToCart = () => {
    alert(product[0].title);
  };

  const ratingChanged = () => {
    console.log("newRating");
  };

  return (
    <>
      <FlexItem>
        <Card>
          <CardHeader
            className="v6-featured-posts-card-header-img"
            style={{
              backgroundImage: `url(${product[0].imageUrl})`,
              height: 175,
              width: 300,
              objectFit: "cover",
            }}
          ></CardHeader>
        </Card>
      </FlexItem>
      <FlexItem>
        <Card>
          <CardTitle>{product[0].title}</CardTitle>
          <CardBody>
            {product[0].rating}
            <ReactStars
              count={5}
              onChange={ratingChanged}
              size={24}
              activeColor="#ffd700"
            />
            {product[0].description}
          </CardBody>
          <CardFooter>
            <Button variant="link" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
        {/* {isProductLoading ? <Skeleton style={{ height: 200 }} /> : <>Hello</>} */}
      </FlexItem>
    </>
  );
}
