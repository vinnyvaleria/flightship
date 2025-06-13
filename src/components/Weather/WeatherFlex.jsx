// src/components/Weather/WeatherFlex.jsx

import { Spinner, Flex, Status } from "@chakra-ui/react";

import { FaCloudRain, FaRegSnowflake, FaWind } from "react-icons/fa";

const WeatherFlex = (data) => {
    return (
        <>
            {data.loading ? (
                <Spinner size="sm" />
            ) : data.error === "" ? (
                <Status.Root colorPalette="red">
                    <Status.Indicator />
                    Fail weather fetch
                </Status.Root>
            ) : (
                <Flex gap={2} color="lightblue">
                    <FaCloudRain
                        size="20px"
                        style={{ opacity: data.isRainLikely ? 1 : 0.2 }}
                    />
                    <FaRegSnowflake
                        size="20px"
                        opacity={data.isSnowLikely ? 1 : 0.2}
                    />
                    <FaWind size="20px" opacity={data.isWindy ? 1 : 0.2} />
                </Flex>
            )}
        </>
    );
};

export default WeatherFlex;
