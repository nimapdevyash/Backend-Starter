const express = require("express");

const router = express.Router();
const fs = require("fs");
const path = require("path");

const basename = path.basename(__filename);

fs.readdirSync(__dirname)
  .filter(
    (dir) =>
      dir.indexOf(".") !== -1 && dir !== basename && dir.slice(-3) === ".js"
  )
  .map((index) => {
    const fileName = index.split(".js")[0]; // using the name of file to append at the start of routes to make it dynamic
    const mainRoute = fileName ? `/${fileName}` : "/";
    const route = require(path.join(`${__dirname}/${index}`));
    return router.use(mainRoute, route);
  });

module.exports = router;