const fs = require("fs");
const path = require("path");

export default function newFolderFiles(destinations, outFolder, fileName){
	let localBaseFile = path.join(__dirname, outFolder, fileName.base.charAt(0));
	if(!destinations.includes(localBaseFile)){
		destinations.push(localBaseFile);
		fs.mkdirSync(localBaseFile);
	}
	return localBaseFile;
}