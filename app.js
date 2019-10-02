const fs = require("fs");
const path = require("path");
const util = require("util");
import copyFile from './copyFile.js';
import newFolderFiles from './newFolderFiles.js';
import walk from './walk.js';

const unlink = util.promisify(fs.unlink);
const rmdir = util.promisify(fs.rmdir);
const mkdir = util.promisify(fs.mkdir);
const exists = util.promisify(fs.exists);

const destinations = [];

if(process.argv.length <= 2){
	process.exit(-1);	
}

let base = process.argv[2]; //имя директории
let outFolder = process.argv[3] || 'outResult'; //конечная папка
let deleteFolder = process.argv[4] || false; 

exists(outFolder)
	.then(data => {
		if (!data){
			mkdir(outFolder);
		}
	})
	.catch(err => {throw new Error(err)})

walk(
  base,
  (filePath) => {
		return new Promise ((resolve, reject) => {
			let fileName = path.parse(filePath);
			let destination = newFolderFiles(destinations, outFolder, fileName);
			copyFile(filePath, path.join(destination, fileName.base))
				.then(() => {
					if(deleteFolder){
						unlink(filePath)
							.then(() => resolve())
							.catch((err) => reject(err))
					} else {
						resolve();
					}
				})
				.catch((err) => reject(err))
			})
  },
  dir => {
		return new Promise((resolve, reject) =>{
			if(deleteFolder){
				rmdir(dir)
					.then(() => resolve())
					.catch((err) => reject(err));
			}
		}) 
  },
);
