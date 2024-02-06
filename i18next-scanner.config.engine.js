module.exports = {
  options: {
    debug: true,
    func: {
      list: ["IllegalMoveError", "t"],
      extensions: [".js"],
    },
    trans: false,
    // Create and update files `en.json`, `fr.json`, `es.json`
    lngs: ["en", "fr", "es"],
    ns: [
      // The namespace I use
      "translation",
    ],
    defaultLng: "en",
    defaultNs: "translation",
    defaultValue: (lng, ns, key) => "",
    // Location of translation files
    resource: {
      loadPath: "src/translations/{{lng}}.json",
      savePath: "src/translations/{{lng}}.json",
      jsonIndent: 4,
    },
    nsSeparator: ":",
    keySeparator: ".",
  },
};
