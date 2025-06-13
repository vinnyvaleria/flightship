// src/components/SearchInput/SearchInput.jsx

import { Field, Input, List, Spinner, Text } from "@chakra-ui/react";

const SearchInput = ({
    type = "text",
    label,
    name,
    value,
    onChange,
    suggestions = [],
    loading,
    error,
    onSuggestionClick,
    showSuggestions = true,
}) => {
    return (
        <Field.Root>
            <Field.Label htmlFor={name} textTransform="capitalize">
                {label}
            </Field.Label>
            <Input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                variant="subtle"
                required
            />

            {/* loading spinner when fetching data */}
            {loading && <Spinner size="sm" />}

            {/* to show error message from fetching if any */}
            {error && <Text color="red.500">{error}</Text>}

            {/* {console.log(suggestions)} */}
            {/* onyly display when suggestions is found */}
            {suggestions.length > 0 && showSuggestions && (
                <List.Root
                    border="1px solid #ccc"
                    borderRadius="md"
                    mt={1}
                    maxHeight="150px"
                    overflowY="auto"
                    zIndex="10"
                    variant="plain"
                    colorPalette="grey"
                >
                    {suggestions.map((suggestion) => (
                        <List.Item
                            key={suggestion.id}
                            padding="8px"
                            _hover={{
                                backgroundColor: "gray",
                                cursor: "pointer",
                            }}
                            onMouseDown={() =>
                                onSuggestionClick &&
                                onSuggestionClick(suggestion, name)
                            }
                        >
                            {suggestion.displayText}
                        </List.Item>
                    ))}
                </List.Root>
            )}
            <Field.ErrorText>This field is required</Field.ErrorText>
        </Field.Root>
    );
};

export default SearchInput;
