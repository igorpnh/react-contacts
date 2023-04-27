import React from "react";
import {
  Container,
  useToast,
  Center,
  Text,
  Button,
  Box,
  Heading,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { Navigate } from "react-router-dom";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app, auth } from "../service/firebase";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const { setUser } = useAuth();
  const currenteUser = auth.currentUser;
  const toast = useToast();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);
    await signInWithPopup(auth, provider)
      .then((result) => {
        if (result.user) {
          const { uid, displayName, photoURL, email } = result.user;

          if (!displayName || !photoURL)
            throw new Error("Usuário não tem photoURL ou displayName");

          setUser({
            id: uid,
            name: displayName,
            email: email,
            avatar: photoURL,
          });

          toast({
            title: "Login com sucesso",
            status: "success",
            position: "top-right",
            duration: 2000,
            isClosable: true,
          });
        }
      })
      .catch((err) => console.log("Erro de login: ", err));
  };

  if (currenteUser) {
    return <Navigate to="/home" replace />;
  }
  return (
    <Container h="100vh" maxW={"container.xl"}>
      <Center d="flex" flexDirection="column" gap={10} h="100%">
        <Box textAlign="center">
          <Heading color="green.300">Contacts</Heading>
          <Text textAlign="center" fontSize="lg">
            Use sua conta Google para salvar contatos 🤙
          </Text>
        </Box>
        <Button onClick={handleGoogleLogin} leftIcon={<FcGoogle />}>
          Login com Google
        </Button>
      </Center>
    </Container>
  );
}
