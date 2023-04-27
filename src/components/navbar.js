import React from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  useToast,
  VStack,
  Heading,
  Text,
  Center,
} from "@chakra-ui/react";
import { HiOutlineLogout } from "react-icons/hi";
import { auth } from "../service/firebase";
import { signOut } from "firebase/auth";
import useAuth from "../hooks/useAuth";
import ColorButton from "./colorButton";

export default function Navbar() {
  const toast = useToast();
  const { user, setUser } = useAuth();

  function Logout() {
    signOut(auth)
      .then(() => {
        setUser();
        toast({
          title: "Desconectado",
          status: "error",
          duration: 2000,
          position: "top-right",
          isClosable: true,
        });
      })
      .catch((err) => console.log("Error: ", err));
  }

  return (
      <Box zIndex={4} position={'fixed'} top={0} width={'100%'} bg={useColorModeValue("gray.200", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={8} alignItems={"center"}>
            <Heading color="green.300">Contacts</Heading>
          </HStack>
          <Flex gap={4} alignItems={"center"}>
            <ColorButton />
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar size={"md"} src={user.avatar} />
              </MenuButton>
              <MenuList>
                <VStack>
                <Avatar size={"lg"} src={user.avatar} />
                  <Text color='green.300'>{user.name}</Text>
                  <Text fontSize="sm">{user.email}</Text>
                </VStack>
                <MenuDivider />
                <MenuItem onClick={Logout} >
                  <Center gap={2}>
                    Logout <HiOutlineLogout fontSize='18px' />
                  </Center>
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Box>
  );
}
