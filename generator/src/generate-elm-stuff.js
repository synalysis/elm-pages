const fs = require("fs");
const runElm = require("./compile-elm.js");
const copyModifiedElmJson = require("./rewrite-elm-json.js");
const { elmPagesCliFile } = require("./elm-file-constants.js");
const path = require("path");

module.exports = function run(
  staticRoutes,
  markdownContent,
  markupContent,
  callback
) {
  ensureDirSync("./elm-stuff");
  ensureDirSync("./elm-stuff/elm-pages");

  // write `Pages.elm` with cli interface
  fs.writeFileSync(
    "./elm-stuff/elm-pages/Pages.elm",
    elmPagesCliFile(staticRoutes, markdownContent, markupContent)
  );

  ensureDirSync("./elm-stuff/elm-pages/Pages");
  fs.copyFileSync(
    path.resolve(__dirname, "../../elm-package/src/Pages/ContentCache.elm"),
    "./elm-stuff/elm-pages/Pages/ContentCache.elm"
  );
  fs.copyFileSync(
    path.resolve(__dirname, "../../elm-package/src/Pages/Platform.elm"),
    "./elm-stuff/elm-pages/Pages/Platform.elm"
  );

  // write modified elm.json to elm-stuff/elm-pages/
  copyModifiedElmJson();

  // run Main.elm from elm-stuff/elm-pages with `runElm`
  runElm(callback);
};

function ensureDirSync(dirpath) {
  try {
    fs.mkdirSync(dirpath, { recursive: true });
  } catch (err) {
    if (err.code !== "EEXIST") throw err;
  }
}
