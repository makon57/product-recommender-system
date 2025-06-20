import { PageSection} from "@patternfly/react-core";
import { CardBasic } from "./carouselCard";


export function App() {
  return (
    <>
      <PageSection hasBodyWrapper={false}>
         <CardBasic />
         <CardBasic />
      </PageSection>
    </>
  );
}
