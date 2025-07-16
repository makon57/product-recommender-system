import {
  Page,
  PageSection,
  TreeView,
  type TreeViewDataItem,
  Sidebar,
  SidebarPanel,
  SidebarContent,
  Flex,
} from "@patternfly/react-core";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Masthead } from "../components/masthead";
import { Wishlist } from "../components/wishlist";
import { getUser } from "../services/auth";


export const Route = createFileRoute("/account")({
  loader: async () => {
    // const userData = await getUser("user_C0VCAR@example.com", "hY9twl7Po5");
    const userData = await getUser();
    console.log(userData);
    // If getUser returns an array, take the first user; otherwise, use as is
    const user = Array.isArray(userData) ? userData[0] : userData;
    if (!user?.user_id) {
      throw redirect({
        to: "/login",
      });
    }
    return { userData: user };
  },
  component: Account,
});

const options: TreeViewDataItem[] = [
  {
    name: "My Account",
    id: "account",

    children: [
      {
        name: "Wishlist",
        id: "saved-products",
      },
    ],
    defaultExpanded: true,
  },
];

function Account() {
  return (
    <Page masthead={<Masthead />}>
      <Sidebar>
        <SidebarPanel variant="sticky">
          <TreeView
            aria-label="account navigation"
            data={options}
            allExpanded={true}
            hasGuides={true}
            // onSelect={onSelect}
          />
        </SidebarPanel>
        <SidebarContent>
          <PageSection>
            <Flex
              direction={{ default: "column" }}
              spaceItems={{ default: "spaceItemsMd" }}
            >
              <Wishlist />
            </Flex>
          </PageSection>
        </SidebarContent>
      </Sidebar>
    </Page>
  );
}
