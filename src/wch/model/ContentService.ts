import { Element } from "./Element"
import * as request from "request-promise-native"
import { Environment } from "../environment"

export default class ContentService {
    static createContent = function (name: string, typeId: string, elements: Element[]) {
        return {
            "name": name,
            "status": "ready",
            "typeId": typeId,
            "elements": elements
        }
    }

    static create = async function (content: any) {
        console.log("CREATING CONTENT")
        console.log("ENVIRONMENT COOKIE" + Environment.cookie)
        try {
            let response = await (<any>request).post(`${Environment.base}/authoring/v1/content`,
                {
                    "headers": {
                        "Cookie": Environment.cookie
                    },
                    json: content
                }
            )
            console.log(response)
            return response
        } catch (err) {
            console.log(err)
            throw err
        }

    }

}