
var fs = require("fs");

var file_write =  function(file, data){
	return new Promise((resolve, reject) => {
		fs.writeFile(file, data, function(error){
			if (error){
				resolve(false);
			}else{
				resolve(true);
			}
		});
	});
}

var file_read =  function(file){
	return new Promise((resolve, reject) => {
		fs.readFile(file, "utf8",  function(error, data){
			if (error){
				resolve(null);
			}else{
				resolve(data);
			}
		});
	});
}

var file_exists =  function(file){
	return new Promise((resolve, reject) => {
		fs.exists(file, exists => {
			if (exists) {
				resolve(true);
			} else {
				resolve(false);
			}
		});
	});
}

var file_stat =  function(file){
	return new Promise((resolve, reject) => {
		fs.stat(file, function(error, stats) {
			if (error){
				resolve(null);
			}else{
				resolve(stats);
			}
		});
	});
}

var file_unlink =  function(file){
	return new Promise((resolve, reject) => {
		fs.unlink(file, (error) => {
			if (error){
				resolve(true);
			}else{
				resolve(false);
			}
		});
	});
}

var file_check_age = async function(filename, sec){
	if (await file_exists(filename)) {
		let file_stat_data = await file_stat(filename);
		if (file_stat_data==null){
			return false;
		}
		
		const { mtime } = file_stat_data;
		var birth_unix = Math.floor(mtime/1000);
		var curr_unix = Math.floor(new Date().getTime()/1000);
		var diff_time = curr_unix - birth_unix;
		
		return (diff_time<sec)?true:false;
	}else{
		return false;
	}
}

var dir_create = function(path){
	return new Promise((resolve, reject) => {
		fs.mkdir(path, { recursive: true }, (error) => {
			if (error){
				resolve(false);
			}else{
				resolve(true);
			}
		});
	});
}

var dir_scan = function(path){
	return new Promise((resolve, reject) => {
		fs.readdir(path, function(error, items) {
			if (error){
				resolve([]);
			}else{
				resolve(items);
			}
		});
	});
}

module.exports = {
	"write": file_write,
	"read": file_read,
	"exists": file_exists,
	"stat": file_stat,
	"unlink": file_unlink,
	"check_age": file_check_age,
	"mkdir": dir_create,
	"scdir": dir_scan
};