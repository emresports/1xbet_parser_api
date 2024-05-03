var app_config = require('app_config');

var dir_paths = [
	app_config.root_dir+"/data/collector",
];

var days_edge_counter = (typeof process.argv[2]!="undefined")?process.argv[2]:0.04;
var time_edge = Math.round(86400*days_edge_counter);

var dir_target = (typeof process.argv[3]!="undefined")?[process.argv[3]]:dir_paths;
dir_paths = dir_target;

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

var clean_info = [];

var run = async function(){
	clean_info = [];
	
	for(let i = 0; i<dir_paths.length; i++){
		
		let files_list = await dir_scan(dir_paths[i]);
		if (files_list.length==0){continue;}
		
		for(let j = 0; j<files_list.length; j++){
			let ext = files_list[j].split(".").pop();
			if (ext!="json"){continue;}
			let file_no_delete_status = await file_check_age(dir_paths[i]+"/"+files_list[j], time_edge);
			if (file_no_delete_status==true){
				continue;
			}
			
			
			if (typeof clean_info[dir_paths[i]]=="undefined"){
				clean_info[dir_paths[i]] = 0;
			}
			
			await file_unlink(dir_paths[i]+"/"+files_list[j]);
			clean_info[dir_paths[i]] += 1;
		}
		
	}
	
	console.log("Clean info: \n", clean_info);
	
	setTimeout(run, 60*1000);
}

run();

module.exports = run;