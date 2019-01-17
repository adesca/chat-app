const resourceCache: {[key: string]: string} = {};
export const fetchResourceAsString = async (resourceName: string) => {
    const url = `${resourceName}`;

    if (resourceCache[resourceName]) {
        return Promise.resolve(resourceCache[resourceName]);
    } else {
        const response: Response = await fetch(url);
        if (response.ok) {
            const text = await response.text();
            resourceCache[resourceName] = text;
            return text;
        } else {
            throw new Error(`Could not find resource: ${resourceName}`);
        }
    }

};

export const fillTemplate = function (templateString: string, templateVars: string[]) {
    return new Function("return `" + templateString + "`;").call(templateVars);
};