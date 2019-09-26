const fs = require("fs");
const path = require("path");

export default function copyFile(source, destination, cb) {
  let cbCalled = false;

	let rd = fs.createReadStream(source);
  rd.on("error", err => done (err));

  let wr = fs.createWriteStream(destination);
  wr.on("error", err => done (err))
    .on("close", () => done(null));

  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}

