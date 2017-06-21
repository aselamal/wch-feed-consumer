import * as express from "express"
import TypeService from "./wch/model/TypeService"
import ContentService from "./wch/model/ContentService"
import ElementDefBuilder from "./wch/model/ElementDefinition"
import ElementBuilder from "./wch/model/Element"

const textDef = ElementDefBuilder.createTextElement
const linkDef = ElementDefBuilder.createLinkElement
const numberDef = ElementDefBuilder.createNumberElement
const createContentType = TypeService.create
const contentType = TypeService.createContentType
const createContent = ContentService.create
const content = ContentService.createContent
const text = ElementBuilder.createTextElement
const link = ElementBuilder.createLinkElement
const number = ElementBuilder.createNumberElement
import { Environment } from "./wch/environment"
import login from "./wch/login"
import FeedFetcher from "./feedFetcher"
import Parser from "./parser/consumer"
import * as bodyParser from "body-parser"
import * as _ from "lodash"
import * as flatten from "flat"
const parser = new Parser()
var cors = require('cors')
const app = express()
app.use(bodyParser.json())
app.use(cors())
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
    //let url = req.query["url"]
    let body = req.body
    run(body).then((result) => {
        res.send(result)
    })
})

init().then(() => {
    app.listen(3000, function () {
        console.log("login here" + Environment.cookie)
        console.log('WCH Feed Consumer app app listening on port 3000!')
    })
})

async function createMapping(data) {
    let typeName = data.typeName ? data.typeName : "MySample" + _.random(0, 1000, false)
    let elements = _.chain(flatten(data.sample)).toPairs().map((entry) => {
        let key = entry[0].replace(".", "_")
        let value = entry[1]
        switch (value) {
            case "__TEXT__": return textDef(key)
            case "__LINK__": return linkDef(key)
            case "__NUMBER__": return numberDef(key)
        }
    }).filter((e) => { return e }).value()

    //console.log(elements)
    let newType = contentType(typeName,
        elements
    )
    let createdType = await createContentType(newType)
    data.typeId = createdType.id
     let root = data.root // rss/channel
    let dataElement = data.dataElement // item
    let path = root.replace("/", ".") + "." + dataElement // rss.channel.item
    let feed = data.doc
    let items: any[] = <any>_.get(feed, path)
    let flatDataSample = flatten(items[0])
    let flatSample = flatten(data.sample)
    let titleKey = _.findKey(flatSample, function (o) { return o === "__TITLE__" })
    let elementsContent = _.chain(flatSample).toPairs().map((entry) => {
        let originalKey = entry[0]
        let key = originalKey.replace(".", "_")
        let mappingValue = entry[1]
        let value = flatDataSample[originalKey]

        switch (mappingValue) {
            case "__TEXT__": return [key, text(value)]
            case "__LINK__": return [key, link(value)]
            case "__NUMBER__": return [key, number(<any>Number(value))]
        }

    }).filter((e) => { return e }).value()
    //console.log(elements)
    data.previewContent = content(flatDataSample[titleKey], data.typeId, elementsContent)


    return data
}

async function fetch(url) {
    let dom = await FeedFetcher.fetch(url)
    let result = parser.parse(dom)
    console.log(JSON.stringify(result))
    return result
}

async function run(body) {
    let root = body.root // rss/channel
    let dataElement = body.dataElement // item
    let path = root.replace("/", ".") + "." + dataElement // rss.channel.item
    let feed = body.doc
    let items: any[] = <any>_.get(feed, path)
    //console.log(items)
    let typeId = body.typeId
    let mapping = body.sample
    let contents = items.map((item) => {
        let flattenedItem = flatten(item)


        let titleKey = _.findKey(mapping, function (o) { return o === "__TITLE__" })

        // [ "guid.link",  { elementtype"htttp://nasa.gov" ]
        let elements = _.chain(mapping).toPairs().map((entry) => {
            let originalKey = entry[0]
            let key = originalKey.replace(".", "_")
            let mappingValue = entry[1]

            let value = flattenedItem[originalKey]

            switch (mappingValue) {
                case "__TEXT__": return [key, text(value)]
                case "__LINK__": return [key, link(value)]
                case "__NUMBER__": return [key, number(<any>Number(value))]
            }

        }).filter((e) => { return e }).value()
        //console.log(elements)
        return content(flattenedItem[titleKey], typeId, elements)
    })
    //console.log(JSON.stringify(contents))
    for (let content of contents) {
        await createContent(content)
    }
    return {
        "imported"  : contents.length,
        "message" : "Success!"
    }
}

async function init() {
    await login()
}
