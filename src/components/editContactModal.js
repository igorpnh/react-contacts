import React, { useState } from "react";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  useToast,
  Button,
} from "@chakra-ui/react";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../service/firebase";

export default function EditContactModal(props) {
  const { open, setOpen, data } = props;
  const toast = useToast();
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");
  const { isOpen, onClose } = useDisclosure({
    isOpen: open,
    onClose() {
      setOpen(!open);
    },
  });

  function formatDate(date) {
    if (date) {
      let replacedDate = date.replace(/-/g, "");

      const year = replacedDate.slice(0, 4);
      const month = replacedDate.slice(4, 6);
      const day = replacedDate.slice(6, 8);

      const correctedDate = `${day}-${month}-${year}`;
      return correctedDate;
    }
  }

  function formatPhone(phoneNumber) {
    phoneNumber = phoneNumber.replace(/\D/g, "");

    if (phoneNumber.length !== 11) {
      return phoneNumber;
    }

    return phoneNumber.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  }

  const handleUpdateContact = async () => {
    await updateDoc(doc(db, "contacts", data.id), {
      name,
      nickname,
      birthday,
      phone,
    });

    toast({
      title: "Contato alterado com sucesso!",
      status: "success",
      position: "top-right",
      duration: 2000,
      isClosable: true,
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Editar</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6}>
            <FormControl>
              <FormLabel>Nome</FormLabel>
              <Input
                onChange={(e) => {
                  if (!e.target.value) setName(data.name)
                  setName(e.target.value)
                }}
                variant="flushed"
                type="text"
                focusBorderColor="green.300"
                autoComplete="off"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Apelido</FormLabel>
              <Input
                onChange={(e) => {
                  if (!e.target.value) setNickname(data.nickname)
                  setNickname(e.target.value)
                }}
                variant="flushed"
                type="text"
                focusBorderColor="green.300"
                autoComplete="off"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Data de Nascimento</FormLabel>
              <Input
                onChange={(e) => {
                  if(!e.target.value) setBirthday(data.birthday)
                  const birthday = formatDate(e.target.value);
                  setBirthday(birthday);
                }}
                variant="flushed"
                type="date"
                focusBorderColor="green.300"
                autoComplete="off"
              />
              <FormHelperText></FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Celular</FormLabel>
              <Input
                onChange={(e) => {
                  if(!e.target.value) setPhone(data.birthday)
                  const phone = formatPhone(e.target.value);
                  setPhone(phone);
                }}
                variant="flushed"
                type="tel"
                focusBorderColor="green.300"
                autoComplete="off"
              />
              <FormHelperText>DDD + Número</FormHelperText>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="green" onClick={handleUpdateContact}>
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
