import { Card, CardTitle, CardBody, CardFooter, CardHeader } from "@patternfly/react-core";

interface ProductData {
  id: number;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
}

interface ProductCardProps {
  product: ProductData; // The 'product' prop will be of type ProductData
  index: number; // The 'index' prop will be a number
}

export const ProductCard: React.FunctionComponent<ProductCardProps> = ({
  product,
  index,
}) => (
  <Card isClickable key={index} isCompact={true}>
    <CardHeader
      selectableActions={{
        // eslint-disable-next-line no-console
        onClickAction: () =>
          console.log(`First card in actionable example clicked`),
        selectableActionAriaLabelledby: "clickable-card-example-title-1",
      }}
    >
      <CardTitle id="clickable-card-example-title-1">
        {product.title}
      </CardTitle>
    </CardHeader>
    <CardBody>{product.imageUrl}</CardBody>
    <CardFooter>{product.description}</CardFooter>
  </Card>
);
