import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  VStack,
  Text,
  Divider,
  HStack,
  Avatar,
  useColorMode,
  Flex,
  Button,
} from "@chakra-ui/react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../service/firebase";
import EditContactModal from "./editContactModal";

export default function Cards(data) {
  const [modalOpen, setModalOpen] = useState(false);
  const { colorMode } = useColorMode();
  const contact = data.data;

  const handleDeleteContact = async () => {
    await deleteDoc(doc(db, "contacts", contact.id));
  };

  return (
    <Card
      boxShadow="dark-lg"
      bg={colorMode === "light" ? "gray.200" : "gray.700"}
      w="18rem"
    >
      <CardHeader textAlign={"center"}>
        <Flex justify="space-between">
          <Heading size="md" color="green.300">
            {contact.nickname}
          </Heading>
          <HStack>
            <Button size={"sm"}>
              <AiOutlineEdit onClick={() => setModalOpen(!modalOpen)} />
              <EditContactModal
                open={modalOpen}
                setOpen={setModalOpen}
                data={contact}
              />
            </Button>
            <Button size={"sm"}>
              <AiOutlineDelete onClick={handleDeleteContact} />
            </Button>
          </HStack>
        </Flex>
      </CardHeader>
      <Divider alignSelf={"center"} width="90%" />
      <CardBody>
        <Flex justify={"space-around"} align={"center"}>
          <Avatar bg='gray.300' size="xl" src={contact.imageUrl} />
          <VStack>
            <Text>{contact.name}</Text>
            <Text>{contact.birthday}</Text>
            <Text>{contact.phone}</Text>
          </VStack>
        </Flex>
      </CardBody>
    </Card>
  );
}
