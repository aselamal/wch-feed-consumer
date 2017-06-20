import * as express from "express"
import TypeService from "./wch/model/TypeService"
import ElementDefBuilder from "./wch/model/ElementDefinition"
const textDef = ElementDefBuilder.createTextElement
const createContentType = TypeService.create
const contentType = TypeService.createContentType
import { Environment } from "./wch/environment"
import login from "./wch/login"
import FeedFetcher from "./feedFetcher"

console.log(login)
//console.log(login.login())

const app = express()

app.get("/", function (req, res) {
    res.send("Hello the return, maybe?")
})

init().then(() => {


    let result = contentType(
        "myTypeName",
        [textDef("myText1"),
        textDef("myText2")]
    )
    //createContentType(result)
    console.log(result)
    app.listen(3000, function () {
        console.log("login here" + Environment.cookie)
        console.log('Example app listening on port 3000!')
    })
})


async function init() {
    await login()
    let dom = await FeedFetcher.fetch("https://www.nasa.gov/rss/dyn/educationnews.rss")
    console.log(dom)
}