const fs = require("fs");
const path = require("path");
const util = require("util");
const mkdirSync = util.promisify(fs.mkdirSync);

export default function newFolderFiles(destinations, outFolder, fileName){
	let localBaseFile = path.join(__dirname, outFolder, fileName.base.charAt(0));
	if(!destinations.includes(localBaseFile)){
		destinations.push(localBaseFile);
		mkdirSync(localBaseFile)
			.then(() => resolve())
			.catch(err => console.log(err))
	}
	return localBaseFile;
}