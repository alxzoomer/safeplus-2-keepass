# safeplus-2-keepass

[Safe+](https://play.google.com/store/apps/details?id=com.zholdak.safeboxpro) XML DB converter to Keepass DB format.

## User guide

### Prerequisites

* Git
* NodeJS
* Yarn (optional)

### Preparation

Clone repo and retrieve NPM packages

```sh
git clone https://github.com/alxzoomer/safeplus-2-keepass.git
cd safeplus-2-keepass
# For yarn users
yarn
# For npm users
npm install
```

Create .env config file
```sh
XML_FILE=safeplus.xml
KDBX_FILE=safeplus.kdbx
# Your very secret password
# Escape $ sign with \
KDBX_PASSWORD="Very\$ecretPa\$\$word"
```

### Fields mapping

If your Safe+ is used with non-Russian locale you need to exam source XML file and
update mapping in the `index.js` file.

Example of the card from the `safeplus.xml`:

```xml
  <card title="Some safe+ card">
      <description>Card description</description>
      <field title="URL"/>
      <field title="E-Mail"/>
      <!-- Russian locale user name -->
      <field title="Имя пользователя">username</field>
      <!-- Russian locale password -->
      <field title="Пароль" hidden="true">password</field>
      <!-- Russian locale Notes -->
      <field title="Примечания"/>
  </card>
```

Example of mapping in the `index.js` from Russian to English.

```js
const m = {
  // Field name is
  Пароль: 'Password',
  'Имя пользователя': 'UserName',
  Ссылка: 'URL',
  Заметка: 'Notes',
  Примечания: 'Notes',
};
```

### Execution

Run from shell

```sh
# For yarn users
yarn r
# For npm users
npm run r
```

That's it!!!

## Links

* [Web Kdbx library](https://github.com/keeweb/kdbxweb)
* [Converts XML to JSON using node-expat](https://github.com/buglabs/node-xml2json)
