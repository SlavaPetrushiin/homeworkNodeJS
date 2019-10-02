const fs = require("fs");

export default function copyFile(source, destination) {
	return new Promise((resolve, reject) => {
		let rd = fs.createReadStream(source);
		rd.on("error", err => reject(err));
	
		let wr = fs.createWriteStream(destination);
		wr.on("error", err => reject(err))
			.on("close", () => resolve());
	
		rd.pipe(wr);
	})
}

