// src/components/Flights/FlightMessage.jsx

import { Blockquote, Float, Box, Textarea, Button } from "@chakra-ui/react";

const FlightMessage = ({
    isEditing,
    onEditingMessage,
    message,
    setMessage,
}) => {
    // set the edit state to true
    const handleEdit = () => {
        onEditingMessage(true);
    };

    // user can cancel edit
    const handleCancel = () => {
        onEditingMessage(false);
    };

    // show text area if editing (whether there's a message or not)
    if (isEditing) {
        return (
            <Box mt={5}>
                <Textarea
                    value={message || ""}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add your message here..."
                    rows={4}
                    resize="vertical"
                    mb={3}
                />
                <Button size="sm" variant="outline" onClick={handleCancel}>
                    Cancel
                </Button>
            </Box>
        );
    }

    // only show the blockquote if there's a message
    if (!message) {
        return null;
    }

    return (
        <Blockquote.Root
            variant="plain"
            colorPalette="pink"
            color="lightpink"
            mt={5}
        >
            <Float placement="top-start" offsetY="2" offsetX="2">
                <Blockquote.Icon />
            </Float>
            <Blockquote.Content ml={2}>{message}</Blockquote.Content>
        </Blockquote.Root>
    );
};

export default FlightMessage;
