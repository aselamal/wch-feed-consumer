
import { Environment } from "./wch/environment"
import * as request from "request-promise-native"
import * as xmldom from "xmldom"
const dom = xmldom.DOMParser
export default class FeedFetcher {

    static fetch = async function (url: string): Promise<Document> {
        let res = await request.get(url, {
            resolveWithFullResponse: true
        })
        console.log(res.body)
        return new dom().parseFromString(res.body)
    }


}