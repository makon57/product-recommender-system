import { createFileRoute } from "@tanstack/react-router";
import { Masthead } from "../../components/masthead";
import { Flex, Page, PageSection } from "@patternfly/react-core";
import { ProductDetails } from "../../components/product-details";

export const Route = createFileRoute("/product/")({
  component: ProductIndexComponent,
});

function ProductIndexComponent() {
  return (
    <Page masthead={<Masthead />}>
      <PageSection>
        <Flex
          justifyContent={{ default: "justifyContentSpaceBetween" }}
          alignItems={{ default: "alignItemsCenter" }}
          direction={{ default: "row" }}
          gap={{ default: "gapSm" }}
          // direction={{ default: "row" }}
          // spaceItems={{ default: "spaceItemsMd" }}
          // columnGap={{ default: 'columnGap2xl' }}
          flexWrap={{ default: 'wrap'}}
        >
          <ProductDetails />
        </Flex>
      </PageSection>
    </Page>
  );
}
