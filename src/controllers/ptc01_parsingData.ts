function jsonToXml(jsonObj: any, rootElementName: string): string {
    let xml = '';

    const toXml = (obj: any) => {
        for (const prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (obj[prop] instanceof Object) {
                    xml += `<${prop}>`;
                    toXml(obj[prop]);
                    xml += `</${prop}>`;
                } else {
                    xml += `<${prop}>${obj[prop]}</${prop}>`;
                }
            }
        }
    };

    xml += `<${rootElementName}>`;
    toXml(jsonObj);
    xml += `</${rootElementName}>`;

    return xml;
}

export {
    jsonToXml,
}