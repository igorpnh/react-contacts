import React, { useEffect, useState } from "react";
import { SimpleGrid, Box, Button } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import { motion } from "framer-motion";
import { auth, db } from "../service/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";
import Navbar from "../components/navbar";
import Cards from "../components/card";
import ContactModal from "../components/addContactModal";

function Home() {
  const { user, setUser } = useAuth();
  const currentUser = auth.currentUser;
  const [modalOpen, setModalOpen] = useState(false);
  const [contactList, setContactList] = useState([]);
  const dbRef = collection(db, "contacts");

  //setUser <- useEffect
  useEffect(() => {
    auth.onAuthStateChanged((data) => {
      if (data) {
        const { uid, displayName, photoURL, email } = data;

        if (!displayName || !photoURL)
          throw new Error("Usuário não tem photoURL ou displayName");

        setUser({
          id: uid ? uid : null,
          name: displayName,
          email: email,
          avatar: photoURL,
        });
      }
    });
  }, [setUser]);

  //getData <- useEffect
  useEffect(() => {
    async function getData() {
      const q = query(dbRef);
      onSnapshot(q, (querySnapshot) => {
        const contacts = querySnapshot.docs.map((doc) => {
          const contactData = { ...doc.data(), id: doc.id };
          return contactData;
        });
        if (!user || !user.id) return;
        const filteredContacts = contacts.filter(
          (contact) => contact.uid === user.id
        );
        filteredContacts.sort((x, y) => {
          let a = x.name.toUpperCase();
          let b = y.name.toUpperCase();
          return a === b ? 0 : a > b ? 1 : -1;
        });
        setContactList(filteredContacts);
      });
    }
    getData();
  }, [setContactList, user, dbRef]);

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />
      <Box px={10} py={4} mt={16}>
        <Button
          onClick={() => setModalOpen(!modalOpen)}
          leftIcon={<AiOutlinePlus />}
        >
          Adicionar
        </Button>
        <ContactModal open={modalOpen} setOpen={setModalOpen} />
      </Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={5} p={10}>
        {contactList.map((data, i) => {
          return (
            <motion.div
              initial={{ opacity: 0, y: "2vw" }}
              animate={{ opacity: 1, y: "0px" }}
              transition={{ type: "spring", duration: 1, bounce: 0 }}
              key={i}
            >
              <Cards data={data} />
            </motion.div>
          );
        })}
      </SimpleGrid>
    </>
  );
}

export default Home;
