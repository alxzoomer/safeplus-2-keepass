const parser = require('xml2json');
const fs = require('fs');
const kdbxweb = require('kdbxweb');
const chalk = require('chalk');

const { log } = console;

require('dotenv').config();

const m = {
  Пароль: 'Password',
  'Имя пользователя': 'UserName',
  Ссылка: 'URL',
  Заметка: 'Notes',
  Примечания: 'Notes',
};

function getName(name) {
  const newName = m[name];
  if (newName) {
    return newName;
  }
  return name;
}

function fill(entry, fields) {
  fields.forEach((field) => {
    if (field.hidden) {
      entry.fields[getName(field.title)] = kdbxweb.ProtectedValue.fromString(field._vv_);
    } else {
      entry.fields[getName(field.title)] = field._vv_;
    }
  });
}

function createEntry(db, group, card) {
  const entry = db.createEntry(group);
  try {
    entry.fields.Title = card.title;
    fill(entry, card.field);
  } catch (error) {
    log(error);
  }
}

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
        createEntry(db, gr, card);
      });
    } else {
      log(`Skip group ${group.title}`);
      // createEntry(db, gr, group.card);
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
