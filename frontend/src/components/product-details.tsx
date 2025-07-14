import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Flex,
  FlexItem,
  Skeleton,
} from "@patternfly/react-core";
import { SingleFakerProducts } from "./faker-products";
import StarRatings from "react-star-ratings";
import type { CartItem } from "../types";
import { fetchProduct } from "../services/products";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Route } from "../routes/product/$productId";

export const ProductDetails = () => {
  // loads productId from route /product/$productId
  const { productId } = Route.useLoaderData()

  // Query for product by productId
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["product", productId], // A unique key for this query
    queryFn: async () => fetchProduct(productId), // The async function to fetch data
  });

  // Delete after testing - faker condition
  const product = data ? data : SingleFakerProducts();

  // // Mutation for adding product to cart
  const handleAddToCart = useMutation<CartItem>({ mutationFn: postProduct(CartItem) })

  // Mutation for buying product now
  const handleBuyNow = () => {
    alert(product[0].title);
  };

  return (
    <>
      {isLoading ? (
        <Skeleton style={{ height: 200 }} />
      ) : (
        <>
          <FlexItem style={{ flex: 1, minWidth: 0, height: "100%" }}>
            <Card style={{ height: "100%" }}>
              <CardBody style={{ height: "100%", padding: 0 }}>
                <img
                  src={product[0].imageUrl}
                  alt={product[0].title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </CardBody>
            </Card>
          </FlexItem>
          <FlexItem style={{ flex: 1, minWidth: 0, height: "100%" }}>
            <Card isPlain style={{ height: "100%" }}>
              <CardTitle style={{ fontSize: "2rem", fontWeight: "bold" }}>
                {product[0].title}
              </CardTitle>
              <CardBody>
                <Flex direction={{ default: "column" }}>
                  <FlexItem>
                    <StarRatings
                      rating={product[0].rating}
                      starRatedColor="black"
                      numberOfStars={5}
                      name="rating"
                      starDimension="18px"
                      starSpacing="1px"
                    />{" "}
                    {product[0].rating}
                  </FlexItem>
                  <FlexItem headers="h1">${product[0].price}</FlexItem>
                  <FlexItem>{product[0].description}</FlexItem>
                </Flex>
              </CardBody>
              <CardFooter>
                <Flex>
                  <FlexItem>
                    <Button variant="secondary" onClick={handleAddToCart}>
                      Add to Cart
                    </Button>
                  </FlexItem>
                  <FlexItem>
                    <Button variant="primary" onClick={handleBuyNow}>
                      Buy Now
                    </Button>
                  </FlexItem>
                </Flex>
              </CardFooter>
            </Card>
          </FlexItem>
        </>
      )}
    </>
  );
}
