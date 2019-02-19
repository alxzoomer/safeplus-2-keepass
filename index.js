var parser = require('xml2json');
var fs = require('fs')
var process = require('process')
var kdbxweb = require('kdbxweb')

if (process.argv.length > 2) {
  if (fs.existsSync(process.argv[2])) {
    let xml = fs.readFileSync(process.argv[2])
    json = parser.toJson(xml, {"object": true, "alternateTextNode": "_vv_"})
    exportToKeepass(json.safeboxplus.folder)
  } else {
    console.log("File doesn't exists")
  }
} else {
  console.log("Please specify existing file path")
}

function exportToKeepass(json) {
  let credentials = new kdbxweb.Credentials(kdbxweb.ProtectedValue.fromString("password123"))
  let db = kdbxweb.Kdbx.create(credentials, 'Passwords Database');
  defaultGroup = db.getDefaultGroup()
  json.forEach(group => {
    console.log(group.title);
    subgroup = db.createGroup(defaultGroup, group.title);
  });
  db.save().then(value => {
    fs.writeFileSync("safeplus.kdbx", Buffer.from(value))
  });
}
