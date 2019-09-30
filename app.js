const fs = require("fs");
const path = require("path");
const util = require("util");
import copyFile from './copyFile.js';
import newFolderFiles from './newFolderFiles.js';
import walk from './walk.js';

const unlink = util.promisify(fs.unlink);
const rmdir = util.promisify(fs.rmdir);
const existsSync = util.promisify(fs.existsSync);
const mkdirSync = util.promisify(fs.mkdirSync);


const destinations = [];

if(process.argv.length <= 2){
	process.exit(-1);	
}

let base = process.argv[2]; //имя директории
let outFolder = process.argv[3] || 'outResult'; //конечная папка
let deleteFolder = process.argv[4] || false; 

function resultFolder(folder){
	return new Promise((resolve, reject) => {
		if (!fs.existsSync(folder)){
			resolve(folder);
		}
	})
}

const resFolder = resultFolder(outFolder);

resFolder
	.then(data => fs.mkdirSync(data))
	.catch(err => console.error(err))



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
				unlink(filePath)
					.then(err => {
						cb(err);				
					})
			} else {
				cb(err);
			}
		})
  },
  dir => {
		if(deleteFolder){
			rmdir(dir)
				.catch( err => {
				console.log("Error: ", err);
			})
		}
  },
  err => {
    console.log("Error: ", err);
  }
);



