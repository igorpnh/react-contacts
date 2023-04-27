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
  Button
} from "@chakra-ui/react";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "../service/firebase";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../service/firebase";
import useAuth from "../hooks/useAuth";

export default function ContactModal(props) {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const { open, setOpen } = props;
  const { isOpen, onClose } = useDisclosure({
    isOpen: open,
    onClose() {
      setOpen(!open);
    },
  });
  const toast = useToast()
  const { user } = useAuth();
  const dbRef = collection(db, "contacts");

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

  const addContact = async () => {
    const imageUrl = image ? await uploadImage(image) : null;
    if (!name || !nickname || !birthday || !phone) {
      toast({
        title: "Insira os dados do contato!",
        status: "error",
        position: "top-right",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    const contactData = {
      uid: user.id,
      name,
      nickname,
      birthday,
      phone,
      imageUrl,
    };
    await addDoc(dbRef, contactData);
    setImage();
    onClose();
  };

  const uploadImage = async (imageFile) => {
    const storageRef = ref(
      storage,
      "gs://contacts-list-6f37e.appspot.com/images/" + imageFile.name
    );
    await uploadBytes(storageRef, imageFile);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Adicionar</ModalHeader>
        <ModalCloseButton color='green.300'/>
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Nome</FormLabel>
              <Input
                onChange={(e) => setName(e.target.value)}
                variant="flushed"
                type="text"
                focusBorderColor="green.300"
                autoComplete="off"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Apelido</FormLabel>
              <Input
                onChange={(e) => setNickname(e.target.value)}
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
                  const birthday = formatDate(e.target.value);
                  setBirthday(birthday);
                }}
                variant="flushed"
                type="date"
                focusBorderColor="green.300"
                autoComplete="off"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Celular</FormLabel>
              <Input
                onChange={(e) => {
                  const phone = formatPhone(e.target.value);
                  setPhone(phone);
                }}
                variant="flushed"
                type="tel"
                focusBorderColor="green.300"
                autoComplete="off"
              />
              <FormHelperText>DD + Número</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Foto de perfil</FormLabel>
              <Input
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
                variant="flushed"
                type="file"
                focusBorderColor="green.300"
                autoComplete="off"
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button color='blackAlpha.900' bg="green.200" _hover={{bg: 'green.300'}} onClick={addContact}>
            Adicionar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
