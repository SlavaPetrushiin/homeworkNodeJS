const fs = require("fs");
const path = require("path");
import copyFile from './copyFile';
import newFolderFiles from './newFolderFiles.js';
import walk from './walk.js';

const destinations = [];

if(process.argv.length <= 2){
	process.exit(-1);	
}

let base = process.argv[2]; //имя директории
let outFolder = process.argv[3] || 'outResult'; //конечная папка
let deleteFolder = process.argv[4] || false; 

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

walk(
  base,
  (filePath, cb) => {
		let fileName = path.parse(filePath);
		let destination = newFolderFiles(destinations, outFolder, fileName);
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

