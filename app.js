const fs = require("fs");
const path = require("path");

const destinations = [];

if(process.argv.length <= 2){
	process.exit(-1);	
}

let base = process.argv[2]; //имя директории
let outFolder = process.argv[3] || 'outResult'; //конечная папка
let deleteFolder = process.argv[4] || false; 

//Создание папки вывода
function resultFolder(folder){
	try {
		if (!fs.existsSync(folder)){
			fs.mkdirSync(folder);
		}
	} catch (err) {
		console.error(err);
	}
}

resultFolder(outFolder);

function copyFile(source, destination, cb) {
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

//Создание именованных папок
function newFolderFiles(fileName){
	let localBaseFile = path.join(__dirname, outFolder, fileName.base.charAt(0));
	if(!destinations.includes(localBaseFile)){
		destinations.push(localBaseFile);
		fs.mkdirSync(localBaseFile);
	}
	return localBaseFile;
}

const walk = function(dir, callbackOnFile, callbackOnFolder, done) {
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

walk(
  base,
  (filePath, cb) => {
		let fileName = path.parse(filePath);
		let destination = newFolderFiles( fileName);
		copyFile(filePath, path.join(destination, fileName.base), err => {
			if (err){
				return cb(err);
			}
			if(deleteFolder){
				fs.unlink(filePath, err => {
					cb(err);				
				})
			} else {
				cb(err);
			}
		})
  },
  dir => {
		if(deleteFolder){
			fs.rmdir(dir, err => {
				console.log("Error: ", err);
			})
		}
  },
  err => {
    console.log("Error: ", err);
  }
);

