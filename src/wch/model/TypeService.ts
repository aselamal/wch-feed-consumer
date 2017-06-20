import { ElementDefinition } from "./ElementDefinition"
import * as request from "request-promise-native"
import { Environment } from "../environment"

export default class TypeService {
    static createContentType = function (name: string, elements: ElementDefinition[]) {
        return {
            "name": name,
            "classification": "content-type",
            "status": "ready",
            "tags": [],
            "elements": elements
        }
    }

    static create = async function (type: any) {
        console.log("CREATING TYPE")
        console.log("ENVIRONMENT COOKIE" + Environment.cookie)
        try {
            let response = await (<any>request).get(`${Environment.base}/authoring/v1/types`,
                {
                    "headers": {
                        "Cookie": Environment.cookie
                    }
                }
            )
            console.log(response)
            //console.log(response.body)
        } catch (err) {
            console.log(err)
            throw err
        }

    }

}