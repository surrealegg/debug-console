/* eslint-disable  @typescript-eslint/no-explicit-any */

const findFromVariable = (
    dest: any[],
    value: string,
    name = "name",
): any | null => {
    const parsedValue = parseInt(value);
    const numeric = isValidInteger(parsedValue);
    for (let i = 0; i < dest.length; ++i) {
        if (
            dest[i] !== null &&
            ((numeric && parsedValue === dest[i].id) ||
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

export { findFromVariable, isValidInteger };
