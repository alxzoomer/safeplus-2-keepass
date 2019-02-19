var parser = require('xml2json');
var fs = require('fs')
var process = require('process')

if (process.argv.length > 2) {
  if (fs.existsSync(process.argv[2])) {
    var xml = fs.readFile(process.argv[2], (err, data) => {
      if (err != null) {
        console.err(err)
      } else {
        xml = data.toString()
        console.log(xml)
        json = parser.toJson(xml, {"object": true, "alternateTextNode": "_vv_"})
        console.log(JSON.stringify(json, undefined, 2))
      }
    })
  } else {
    console.log("File doesn't exists")
  }
} else {
  console.log("Please specify existing file path")
}
