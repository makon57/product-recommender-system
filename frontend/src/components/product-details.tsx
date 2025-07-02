import { FlexItem, Skeleton, Title } from "@patternfly/react-core";
import { FakerProducts } from "./faker-products";
import { fetchProduct } from "../services/products";
import { useQuery } from "@tanstack/react-query";
import { Route } from "../routes/product/$productId";

export function ProductDetails() {
  const { productId } = Route.useParams();
  const {
    data: productItem,
    error: productError,
    isLoading: isProductLoading,
  } = useQuery({
    queryKey: ["product", productId], // A unique key for this query
    queryFn: async () => fetchProduct(productId), // The async function to fetch data
  });

    const product = productItem ? productItem : FakerProducts(1);

  return (
    <>
      <FlexItem>
        <Title headingLevel={"h1"} style={{ paddingBottom: 20 }}>
          {product[0].title}
        </Title>
        {isProductLoading ? <Skeleton style={{ height: 200 }} /> : <>Hello</>}
      </FlexItem>
    </>
  );
}
