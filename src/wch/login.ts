import { Environment } from "./environment"
import * as request from "request-promise-native"
import * as setCookie from "set-cookie-parser"

export default async function login(): Promise<string> {
    console.log("calling login")
    try {

        let response = await (<any>request).get(`${Environment.base}/login/v1/basicauth`,
            {
                "auth": {
                    "username": Environment.username,
                    "password": Environment.password
                },
                resolveWithFullResponse: true
            }
        )
        let cookies = setCookie.parse(response)
        let loginInfo = ""
        for (let cookie of cookies) {
            loginInfo = loginInfo + cookie.name + "=" + cookie.value + ";"
        }

        //let loginInfo = "SOmeCookie"
        console.log("acquired login cookie" + loginInfo)
        Environment.cookie = loginInfo
        return loginInfo

    } catch (err) {
        console.log(err)
        throw err
    }
}

