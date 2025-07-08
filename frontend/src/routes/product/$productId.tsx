import { createFileRoute } from "@tanstack/react-router";
import { Flex, Page, PageSection } from "@patternfly/react-core";
import { ProductDetails } from "../../components/product-details";
import { Masthead } from "../../components/masthead";
import { fetchProduct } from "../../services/products";

export const Route = createFileRoute('/product/$productId')({
  loader: ({ params: { productId } }) => fetchProduct(productId),
  component: ProductComponent,
});

function ProductComponent() {
 return (
  <Page masthead={<Masthead />}>
      <PageSection>
        <Flex
          direction={{ default: "column" }}
          spaceItems={{ default: "spaceItemsXl" }}
        >
          <ProductDetails />
        </Flex>
      </PageSection>
    </Page>
 )
}
