const i18n = require('i18n');
const path = require('path');

i18n.configure({
    locales: ['es', 'en'],
    directory: path.join(__dirname, '..', 'locales'),
    defaultLocale: 'en',
    autoReload:true, //Watch for changes in json files to reload locale on updates
    syncFiles: true, //Sync locale information across all files
    cookie: 'nodepop-locale',
});

// para utilizar en scripts
i18n.setLocale('en');

module.exports = i18n;