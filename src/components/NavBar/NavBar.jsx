// src/components/NavBar/NavBar.jsx

import { Box, Flex, Heading, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <>
            <Box as="nav" px={2} color="white" placeItems="center">
                <Flex gap={2} p={5} alignItems="center">
                    <Image
                        src="src/assets/images/flightship.png"
                        alt="flightship-logo"
                        h="50px"
                        w="fit-content"
                    />
                    <Heading as="h1">Flightship</Heading>
                </Flex>
                <Flex as="ul" gapX={5}>
                    <Box as="li">
                        <Link to="/">Home</Link>
                    </Box>
                    <Box as="li">
                        <Link to="/saved-flights">Saved Flights</Link>
                    </Box>
                </Flex>
            </Box>
        </>
    );
};

export default NavBar;
