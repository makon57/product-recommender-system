import { Card, CardTitle, CardBody} from '@patternfly/react-core';
import Responsive from './carousel';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const CardBasic: React.FunctionComponent = () => (
  <Card ouiaId="BasicCard">
    <CardTitle>Product Recommendations</CardTitle>
    <CardBody>
        <Responsive />
    </CardBody>
  </Card>
);
