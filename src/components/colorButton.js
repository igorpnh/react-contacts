import { useColorMode, Button } from "@chakra-ui/react";
import React from "react";
import { BiMoon, BiSun } from "react-icons/bi";

export default function ColorButton() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button onClick={toggleColorMode}>
      {colorMode === "light" ? <BiMoon /> : <BiSun />}
    </Button>
  );
}
