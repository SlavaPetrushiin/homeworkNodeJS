const fs = require("fs");
const path = require("path");
const util = require("util");
const readdir = util.promisify(fs.readdir);

export default function walk (dir, callbackOnFile, callbackOnFolder, done) {
	readdir(dir)
		.then(directory => {
			return Promise.all(directory.map(async item => {
				let filePath = path.join(dir, item);
				fs.stat(filePath, (err, stats)=>{
					if (stats && stats.isDirectory()) {
						walk(
							filePath,
							callbackOnFile,
							callbackOnFolder,
							err => {
								console.log("Error: ", err);
							}
						);
					} else {
						callbackOnFile(filePath,  err => {
							console.log("Error: ", err);
						});
					}						
				})
			}))
		})
		.then(() => callbackOnFolder(dir))
		.catch(err =>  done(err))
};


