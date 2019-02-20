const parser = require('xml2json');
const fs = require('fs');
const kdbxweb = require('kdbxweb');
const chalk = require('chalk');

const { log } = console;

require('dotenv').config();

function exportToKeepass(json) {
  const credentials = new kdbxweb.Credentials(kdbxweb.ProtectedValue.fromString('password123'));
  const db = kdbxweb.Kdbx.create(credentials, 'Passwords Database');
  const defaultGroup = db.getDefaultGroup();
  json.forEach((group) => {
    log(`Group "${chalk.blue(group.title)}"`);
    const gr = db.createGroup(defaultGroup, group.title);
    gr.notes = group.description;
    // log(group.card);
    if (group.card instanceof Array) {
      group.card.forEach((card) => {
        // log(JSON.stringify(card, undefined, 2));
      });
    } else {
      // log(JSON.stringify(group.card, undefined, 2));
    }
  });

  db.save().then((value) => {
    fs.writeFileSync(process.env.KDBX_FILE, Buffer.from(value));
  });
}

function main() {
  const xmlFilePath = process.env.XML_FILE;
  if (xmlFilePath) {
    if (fs.existsSync(xmlFilePath)) {
      const xml = fs.readFileSync(xmlFilePath);
      const json = parser.toJson(xml, { object: true, alternateTextNode: '_vv_' });
      exportToKeepass(json.safeboxplus.folder);
    } else {
      log(`File ${xmlFilePath} doesn't exists`);
    }
  } else {
    log('Please specify existing file path');
  }
}

main();
