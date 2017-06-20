import * as xpath from "xpath"
import * as _ from "lodash"
import * as parser from "xml2json"
import * as xmldom from "xmldom"
const XMLSerializer = xmldom.XMLSerializer
const serializer = new XMLSerializer()
export interface Mapping {
    root: String
    dataElement: String
    sample: any
    doc: any

}


export default class Parser {

    parse = function (doc: Document): Mapping {
        let nodes = xpath.select("count(/*)", doc)

        let rootNames = searchForDocumentRoot(undefined, doc)
        let rootPath = rootNames.map((n) => "*[local-name()='" + n + "']").join("/")
        console.log("Root Located as: " + rootPath)
        var listElement = findListElement(rootPath, doc)
        console.log("Data element found with name: " + listElement)

        var sampleXpath = rootPath + "/*[local-name()='" + listElement + "'][1]"
        var sample = <any>xpath.select(sampleXpath, doc)[0]
        var json = JSON.parse(parser.toJson(serializer.serializeToString(doc)))
        var sampleJson = JSON.parse(parser.toJson(serializer.serializeToString(sample)))[listElement]

        return {
            root: rootNames.join("/"),
            dataElement: listElement,
            sample: sampleJson,
            doc: json
        }
    }


}








function searchForDocumentRoot(paths, doc) {
    if (!paths) {
        let count: number = <any>xpath.select("count(/*)", doc)
        var name = xpath.select("name(/*)", doc)
        if (count <= 4) {
            return searchForDocumentRoot([name], doc)
        } else {
            return [name]
        }
    } else {

        var pathForXpath = paths.map((n) => "*[local-name()='" + n + "']").join("/")
        console.log(pathForXpath)
        var count = <any>xpath.select("count(" + pathForXpath + "/*)", doc)
        var nodes = xpath.select(pathForXpath + "/*", doc)

        for (let node of nodes) {
            var newPaths = _.clone(paths)
            let name: string = node["nodeName"]
            console.log(name)
            if (count <= 4) {
                if (name === '') {
                    throw "No candidate found"
                }
                newPaths.push(name)
                try {
                    var result = searchForDocumentRoot(newPaths, doc)
                    return result
                } catch (err) {
                    console.log(err)
                }
            } else {
                return newPaths
            }
        }
        throw "No candidate found"


    }

}

function findListElement(rootPath, doc) {
    var count = <any>xpath.select("count(" + rootPath + " /*)", doc)
    var names = []
    for (let i = 0; i < count; i++) {
        var name = xpath.select("name(" + rootPath + " /*[" + i + "])", doc)
        names.push(name)
    }

    return _.chain(names).countBy().toPairs().maxBy(_.last).head().value()
}
