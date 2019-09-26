const fs = require("fs");
const path = require("path");

export default function walk (dir, callbackOnFile, callbackOnFolder, done) {
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let i = 0;
    const next = function(doneList) {
      if (err) return doneList(err);
			
			let filePath = list[i++];

      if (!filePath) return doneList(null);

      filePath = path.join(dir, filePath);

      fs.stat(filePath, (_, stat) => {

        if (stat && stat.isDirectory()) {
          walk(
            filePath,
            callbackOnFile,
            callbackOnFolder,
            next.bind(null, doneList)
          );
        } else {
          callbackOnFile(filePath, next.bind(null, doneList));
        }
      });
    };

    next(err => {
      if (!err) callbackOnFolder(dir);
      done(err);
    });
  });
};

