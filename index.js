const parser = require('xml2json');
const fs = require('fs');
const process = require('process');
const kdbxweb = require('kdbxweb');

require('dotenv').config();

const xmlFilePath = process.env.XML_FILE;
function exportToKeepass(json) {
  const credentials = new kdbxweb.Credentials(kdbxweb.ProtectedValue.fromString('password123'));
  const db = kdbxweb.Kdbx.create(credentials, 'Passwords Database');
  const defaultGroup = db.getDefaultGroup();
  json.forEach((group) => {
    console.log(group.title);
    const gr = db.createGroup(defaultGroup, group.title);
    gr.notes = group.description;
    console.log(group.card);
    if (group.card instanceof Array) {
      group.card.forEach((card) => {
        console.log(JSON.stringify(card, undefined, 2));
      });
    } else {
      console.log(JSON.stringify(group.card, undefined, 2));
    }
  });

  db.save().then((value) => {
    fs.writeFileSync(process.env.KDBX_FILE, Buffer.from(value));
  });
}

if (xmlFilePath) {
  if (fs.existsSync(xmlFilePath)) {
    const xml = fs.readFileSync(xmlFilePath);
    const json = parser.toJson(xml, { object: true, alternateTextNode: '_vv_' });
    exportToKeepass(json.safeboxplus.folder);
  } else {
    console.log(`File ${xmlFilePath} doesn't exists`);
  }
} else {
  console.log('Please specify existing file path');
}
