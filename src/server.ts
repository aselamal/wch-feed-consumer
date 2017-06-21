import * as express from "express"
import TypeService from "./wch/model/TypeService"
import ContentService from "./wch/model/ContentService"
import ElementDefBuilder from "./wch/model/ElementDefinition"
const textDef = ElementDefBuilder.createTextElement
const linkDef = ElementDefBuilder.createLinkElement
const numberDef = ElementDefBuilder.createNumberElement
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
    let elements = _.chain(flatten(data.sample)).toPairs().map((entry) => {
        let key = entry[0].replace(".", "_")
        let value = entry[1]
        switch (value) {
            case "__TEXT__": return textDef(key)
            case "__LINK__": return linkDef(key)
            case "__NUMBER__": return numberDef(key)
        }
    }).filter( (e) => { return e }).value()

    console.log(elements)
    let newType = contentType(
        "MySample" +  _.random(0, 1000, false),
        elements
    )
    let createdType = await createContentType(newType)
    data.typeId = createdType.id;
    return 
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