import { Page, PageSection } from "@patternfly/react-core";
import { createFileRoute } from "@tanstack/react-router";
import { Masthead } from "../components/masthead";
import { SearchPage } from "../components/search-page";

export const Route = createFileRoute("/search")({
  component: Search,
});

function Search() {
  return (
    <Page masthead={<Masthead />}>
      <PageSection>
          <SearchPage />
      </PageSection>
    </Page>
  );
};
