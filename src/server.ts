import * as express from "express"
import TypeService from "./wch/model/TypeService"
import ContentService from "./wch/model/ContentService"
import ElementDefBuilder from "./wch/model/ElementDefinition"
const textDef = ElementDefBuilder.createTextElement
const createContentType = TypeService.create
const contentType = TypeService.createContentType
const createContent = ContentService.create
const content = ContentService.createContent
import { Environment } from "./wch/environment"
import login from "./wch/login"
import FeedFetcher from "./feedFetcher"
import Parser from "./parser/consumer"
import * as bodyParser from "body-parser"
import * as _ from "lodash"
import * as flatten from "flat"
const parser = new Parser()

const app = express()
app.use(bodyParser.json())
app.get("/fetch", function (req, res) {
    let url = req.query["url"]
    fetch(url).then((data) => {
        res.send(data)
    })
})

app.post("/create", function (req, res) {
    let mappingRequest = req.body
    createMapping(mappingRequest).then((result) => {
        res.send(result)
    })
})

app.post("/run", function (req, res) {
    let url = req.query["url"]
    let typeId = req.query["typeId"]
    let mapping = req.body
})

init().then(() => {
    app.listen(3000, function () {
        console.log("login here" + Environment.cookie)
        console.log('WCH Feed Consumer app app listening on port 3000!')
    })
})

async function createMapping(data) {
  let elements = _.chain(flatten(data.sample)).toPairs().filter((entry) => entry[1] === "__TEXT__" ).map(
        (entry) => textDef(entry[0])
    ).value()
    console.log(elements)
    let newType = contentType(
        "MySample",
        elements
    )
    let result = await createContentType(newType)
    return result
}

async function fetch(url) {
    let dom = await FeedFetcher.fetch(url)
    let result = parser.parse(dom)
    console.log(JSON.stringify(result))
    return result
}

async function init() {
    await login()
}