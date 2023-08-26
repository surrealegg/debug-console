const findFromVariable = <T extends object>(
    dest: T[],
    value: string,
    name: keyof T,
    id: keyof T,
): T | null => {
    const parsedValue = parseInt(value);
    const numeric = isValidInteger(parsedValue);
    for (let i = 0; i < dest.length; ++i) {
        if (
            dest[i] !== null &&
            ((numeric && parsedValue === dest[i][id]) ||
                dest[i][name] === value)
        ) {
            return dest[i];
        }
    }
    return null;
};

const isValidInteger = (value: number): boolean => {
    return !isNaN(value) && isFinite(value);
};

const addQuotes = (name: string): string => {
    const hasSpaces = name.indexOf(" ") > -1;
    const hasQuotes = name.startsWith('"') && name.endsWith('"');
    if (hasSpaces && !hasQuotes) {
        return `"${name}"`;
    }

    return name;
};

const mergeIDAndName = (id: number, name: string): string => {
    if (name === "") {
        return String(id);
    }

    return `${id}:${addQuotes(name)}`;
};

export {
    addQuotes,
    findFromVariable,
    isValidInteger,
    mergeIDAndName,
};
