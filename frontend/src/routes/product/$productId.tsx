import { createFileRoute } from "@tanstack/react-router";
import { Flex, Page, PageSection } from "@patternfly/react-core";
import { ProductDetails } from "../../components/product-details";
import { Masthead } from "../../components/masthead";

export const Route = createFileRoute("/product/$productId")({
  loader: async ({ params: { productId } }) => {
    return {
      productId
    };
  },
  component: ProductComponent,
});

function ProductComponent() {
  return (
    <Page masthead={<Masthead />}>
      <PageSection>
        <Flex
          justifyContent={{ default: "justifyContentSpaceBetween" }}
          alignItems={{ default: "alignItemsCenter" }}
          direction={{ default: "row" }}
          style={{ width: "100%", height: "60vh" }}
        >
          <ProductDetails />
        </Flex>
      </PageSection>
    </Page>
  );
}
