const fs = require("fs");

const saveToDB = (DB) => {
  console.log("_____________ writingFileInDB");
  fs.writeFileSync("./src/database/db.json", JSON.stringify(DB, null, 2), {
    encoding: "utf-8",
  });
};

module.exports = { saveToDB };
