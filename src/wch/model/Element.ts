export interface Element {
    elementType: string
    value: string
}


export default class ElementBuilders {

    static createTextElement = function (value: string): Element {
        return {
            "elementType": "text",
            "value": value
        }
    }

}