// src/components/NavBar/NavBar.jsx

import { Box, Flex, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <>
            <Box as="nav" px={2} color="white" placeItems="center">
                <Flex as="ul" gap={3} alignItems="center">
                    <Box as="li">
                        <Link to="/" className="logo">
                            <Image
                                src="src/assets/images/flightship.png"
                                alt="flightship-logo"
                                h="50px"
                                w="fit-content"
                            />
                        </Link>
                    </Box>
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
