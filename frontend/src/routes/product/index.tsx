import { createFileRoute } from '@tanstack/react-router'
import { Masthead } from '../../components/masthead';
import { Page, PageSection } from '@patternfly/react-core';
import { ProductDetails } from '../../components/product-details';

export const Route = createFileRoute('/product/')({
  component: ProductIndexComponent,
})

function ProductIndexComponent() {
  return (
    <Page masthead={<Masthead />}>
      <PageSection hasBodyWrapper={false}>
        <ProductDetails />
      </PageSection>
    </Page>
  );
}
