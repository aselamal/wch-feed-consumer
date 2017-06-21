export interface ElementDefinition {
    elementType: string
    key: string
    label: string
}


export default class ElementDefinitionBuilders {

    static createTextElement = function (key: string): ElementDefinition {
        return {
            "elementType": "text",
            "key": key,
            "label": key
        }
    }

    static createNumberElement = function (key: string): ElementDefinition {
        return {
            "elementType": "number",
            "key": key,
            "label": key
        }
    }

     static createLinkElement = function (key: string): ElementDefinition {
        return {
            "elementType": "link",
            "key": key,
            "label": key
        }
    }

}