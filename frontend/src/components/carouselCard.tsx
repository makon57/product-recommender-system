import { Title } from "@patternfly/react-core";
import Responsive from "./carousel";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const CardBasic: React.FunctionComponent = () => (
  <>
    <Title headingLevel={"h1"}>Product Recommendations</Title>
    <Responsive />
  </>
);
