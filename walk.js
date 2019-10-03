const fs = require("fs");
const path = require("path");
const util = require("util");
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);

export default function walk (dir, callbackOnFile, callbackOnFolder) {
	return new Promise((resolve, reject) => {
		readdir(dir)
		.then(directory => {
			return Promise.all(directory.map(async item => {
				let filePath = path.join(dir, item);
				await stat(filePath)
					.then(async stats => {
						if (stats && stats.isDirectory()) {
							await walk(
								filePath,
								callbackOnFile,
								callbackOnFolder
							);
						} else {
							await callbackOnFile(filePath);
						}							
					})
					.catch(err => reject(err))
			}))
		})
		.then(() => callbackOnFolder(dir))
		.then(() => resolve(null))
		.catch(err => reject(err))
	})
};


