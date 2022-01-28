/* eslint-disable  @typescript-eslint/no-explicit-any */

const findFromVariable = (
    dest: any[],
    value: string,
    name = "name",
    id = "id",
): any | null => {
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

const isValidInteger = (value: any): boolean => {
    return !isNaN(value) && isFinite(value);
};

const addQuotes = (name: string): string => {
    return name.indexOf(" ") > -1 ? `"${name}"` : name;
};

const mergeIDAndName = (id: number, name: string): string => {
    return `${id}:${addQuotes(name)}`;
};

export {
    addQuotes,
    findFromVariable,
    isValidInteger,
    mergeIDAndName,
};
