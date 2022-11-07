import {
  Link,
  Flex,
  Menu,
  MenuItem,
  MenuButton,
  useAuthenticator,
} from "@aws-amplify/ui-react";

export default function Header() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  return (
    <>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        alignContent="center"
        wrap="wrap"
        // gap="1rem"
        width="80%"
      >
        <Link href="/">amplify-apprunner</Link>

        <Flex alignItems="center">
          {user && (
            <Menu
              menuAlign="end"
              trigger={
                <MenuButton variation="menu">
                  {user.attributes.email}
                </MenuButton>
              }
            >
              <MenuItem onClick={signOut}>Sign out</MenuItem>
            </Menu>
          )}
        </Flex>
      </Flex>
    </>
  );
}
