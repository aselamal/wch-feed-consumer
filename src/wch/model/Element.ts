export interface Element {
    elementType: string
    value?: string
    linkURL?: string
}


export default class ElementBuilders {

    static createTextElement = function (value: string): Element {
        return {
            "elementType": "text",
            "value": value
        }
    }

    static createLinkElement = function (value: string): Element {
        return {
            "elementType": "link",
            "linkURL": value
        }
    }

    static createNumberElement = function (value: string): Element {
        return {
            "elementType": "number",
            "value": value
        }
    }

}