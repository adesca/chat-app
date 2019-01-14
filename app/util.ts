export const fetchResourceAsString = async (resourceName: string) => {
    const url = `${resourceName}`;

    const response: Response = await fetch(url);
    if (response.ok) {
        return response.text();
    } else {
        throw new Error(`Could not find resource: ${resourceName}`);
    }
};
