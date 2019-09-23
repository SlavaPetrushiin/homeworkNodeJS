const fs = require("fs");
const path = require("path");

if(process.argv.length <= 2){
	console.log("Usage: " + __filename + " path/to");
	process.exit(-1);	
}

let base = process.argv[2]; //имя директории
let outFolder = process.argv[3] || 'outResult'; //конечная папка

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

function copyFile(source, file, cb) {
  let cbCalled = false;

	let rd = fs.createReadStream(source);
  rd.on("error", err => done (err));

  let wr = fs.createWriteStream(path.join(newFolderFiles(file), file)); 
  wr.on("error", err => done (err))
    .on("close", () => unLinkFile(source));

  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}

//Удаление файла
function unLinkFile(file){
	fs.unlink(file, err => {
		if (err) {
			console.log(err);
		} else {
			console.log("Файл удалён");
		}		
	})
}
//Удаление папки
/*function unLinkFolder(folder){
	fs.rmdir(folder, err => {
		if (err) {
			console.log(err);
		} else {
			console.log("Папка удалена");
		}		
	})
}*/

//Создание именованных папок
function newFolderFiles(file){
	let localBaseFile = path.join(__dirname, outFolder, file.charAt(0));
	try {
		if(!fs.existsSync(localBaseFile)){
			fs.mkdirSync(localBaseFile);
		}
	} catch (err) {
		console.error(err);
	}
	return localBaseFile;	
}

const walk = function(dir, callbackOnFile, callbackOnFolder, done) {
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let i = 0;
    const next = function(doneList) {
      if (err) return doneList(err);
			
			let filePath = list[i++]; //получаю первый элемент массива

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
		console.log("File: ", filePath);
		let fileName = path.parse(filePath); //Метод path.parse() возвращает объект, чьи свойства представляют собой  элементы пути.
		copyFile(filePath, fileName.base, err => {
			console.log('done', err)
		})

    cb();
  },
  dir => {
		console.log("Directory: ", dir);
  },
  err => {
    console.log("Error: ", err);
  }
);

