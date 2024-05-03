var app_config = require('app_config');
var https = require("https");
var moment = require('moment');

/* 
*	Функция для проверки является ли файл старше указного промежутка времени
*
*	@param {String} - filename - имя файла
*	@param {Integer} - sec - время в секундах
*
*	@return {Boolean} -  статус проверки
*
*/
var check_old_file = async function(filename, sec){
	if (await flt.exists(filename)) {
		let file_stat = await flt.stat(filename);
		if (file_stat==null){
			return false;
		}
		
		const { mtimeMs, mtime } = file_stat;
		var birth_unix = moment(mtime).unix();
		var curr_unix = moment().unix();
		var diff_time = curr_unix - birth_unix;
		
		return (diff_time<sec)?true:false;
	}else{
		return false;
	}
}

var call_wait_list = function(filename, data){
	if (typeof wait_list[filename]=="undefined"){return false;}
	for(let i = 0; i<wait_list[filename].length; i++){
		wait_list[filename][i](data);
	}

	delete wait_list[filename];
	return true;
}

/* 
*	Функция для чтения данных из ссылки или из файла
*
*
*	@return {String} -  Данные
*
*/
var read_data = async function(filename, url, cb, old_time = app_config.xbet_old_time){
	if(typeof reader_lock[filename]!="undefined"){//console.log("Lock..");
		if(typeof wait_list[filename]=="undefined"){
			wait_list[filename] = [];
		}
		wait_list[filename].push(cb);
		//cb("");
		return "";
	}
	reader_lock[filename] = true;
	let file_exist = await check_old_file(filename, old_time);
	
	let fn_lock_storage = filename.split("/"),
		fn_lock_storage_last = fn_lock_storage.length-1;
		  
	fn_lock_storage[fn_lock_storage_last] = "lock_"+fn_lock_storage[fn_lock_storage_last];
	
	let filename_lock = fn_lock_storage.join("/");
	let file_lock_exist = await check_old_file(filename_lock, old_time+1);
	
	let run_request = async function(){//console.log("Request..");
		let req = https.get(url, res => {
			res.setEncoding("utf8");
			let body = "";
			
			res.on("data", data => {
				body += data;
			});
			
			res.on("end", async function() {
				delete reader_lock[filename];
				body = body.trim();
				if (body!=""){
					await flt.write(filename, body);
				}
				
				try{
					await flt.unlink(filename_lock);
				}catch(e){}
				cb(body);
				call_wait_list(filename, body);
			});
			
			res.on('error', function(e) {
				console.log('Ошибка обращения к хбет: ', url, e);
				cb("");
				delete reader_lock[filename];
				call_wait_list(filename, "");
			});
		}).on('error', function(e) {
			console.log('Ошибка обращения к хбет: ', url, e);
			cb("");
			delete reader_lock[filename];
			call_wait_list(filename, "");
		});
		
		req.end();
	}
	
	if (file_exist==false && file_lock_exist==true){
		cb("");
		delete reader_lock[filename];
		call_wait_list(filename, "");
	}else if (file_exist==false){
		await flt.write(filename_lock, "");
		run_request();
	}else{
		if (file_lock_exist==true){
			await flt.unlink(filename_lock);
		}
		let file_data = await flt.read(filename);
		
	}
}

module.exports = read_data;