module.exports = {
    options: {
        debug: true,
        // read strings from functions: IllegalMoveError('KEY') or t('KEY')
        func: {
            list: ['IllegalMoveError', 't'],
            extensions: ['.js'],
        },

        trans: false,

        // Create and update files `en.json`, `fr.json`, `es.json`
        lngs: ['en', 'fr', 'es'],

        ns: [
            // The namespace I use
            'translation',
        ],

        defaultLng: 'en',
        defaultNs: 'translation',

        // Put a blank string as initial translation
        // (useful for Weblate be marked as 'not yet translated', see later)
        defaultValue: (lng, ns, key) => '',

        // Location of translation files
        resource: {
            loadPath: 'src/translations/{{lng}}.json',
            savePath: 'src/translations/{{lng}}.json',
            jsonIndent: 4,
        },

        nsSeparator: ':',
        keySeparator: '.',
    },
};