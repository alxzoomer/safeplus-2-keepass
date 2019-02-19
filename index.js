var parser = require('xml2json');
var fs = require('fs')
var process = require('process')

if (process.argv.length > 2) {
  if (fs.existsSync(process.argv[2])) {
    var xml = fs.readFileSync(process.argv[2])
    json = parser.toJson(xml, {"object": true, "alternateTextNode": "_vv_"})
    exportToKeepass(json.safeboxplus.folder)
  } else {
    console.log("File doesn't exists")
  }
} else {
  console.log("Please specify existing file path")
}

function exportToKeepass(json) {
  console.log(JSON.stringify(json, undefined, 2))
}
