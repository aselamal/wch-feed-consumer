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

}