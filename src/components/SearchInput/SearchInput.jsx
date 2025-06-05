import { useState } from "react";
import { Field, Input } from "@chakra-ui/react";

const SearchInput = ({
    label,
    name,
    value,
    onChange,
    suggestions = [],
    loading,
    error,
}) => {
    // only show first 5 matched from the record
    const [searchSuggestions, setSearchSUggestions] = useState([]);

    return (
        <>
            <Field.Root>
                <Field.Label htmlFor={name} textTransform="capitalize">
                    {label}
                </Field.Label>
                <Input
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    variant="subtle"
                    required
                />
                <Field.ErrorText>This field is required</Field.ErrorText>
            </Field.Root>
        </>
    );
};

export default SearchInput;
