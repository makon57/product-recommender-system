import { PageSection, Title } from "@patternfly/react-core";
// import { CardBasic } from "./carouselCard";
import Responsive from "./carousel";


export function App() {
  return (
    <>
      <PageSection hasBodyWrapper={false}>
         {/* <CardBasic /> */}
         <Title headingLevel={"h1"}>Product Recommendations</Title>
        <Responsive />
      </PageSection>
    </>
  );
}
