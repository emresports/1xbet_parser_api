var app_config = require('app_config');
var md5 = require('md5');
const helpers  =  require(app_config.root_dir+"/lib/helper.js");

var add_package = async function(data, cb){
	if (check_keys==false){cb("You have error in fields data!", 99); return false;}
	
	let now = Math.round(new Date().getTime()/1000);
	let package_link = md5(data.name+now);

	if(typeof data["package"]!="undefined"){
		package_link = data["package"];
	}

	let start_time = 0;
	let end_time = 0;
	if(typeof data["start_time"]==0){
		start_time = Math.round(new Date().getTime()/1000);
	}else{
		start_time = data["start_time"];
	}

	if(typeof data["end_time"]==0){
		end_time = start_time+(86400*30);
	}else{
		end_time = data["end_time"];
	}
	
	
	
	var [insert] = await helpers.db_request('INSERT INTO _cl_packages(start_time,end_time,price) VALUES (?,?,?,?,?,?,?,?,?)', 
								[data.country_no_block,start_time,end_time,data.price]);
	
	if (typeof insert['affectedRows']=="undefined" || insert['affectedRows']==0){
		cb("Error add package!!", 99); return false;
	}
	
	cb("Package added!", 1);
	
	return "Package add";
};

var edit_package = async function(data, cb){
	let check_keys = helpers.check_need_key(data,[\"start_time","end_time","package"]);
	if (check_keys==false){cb("You have error in fields data!", 99); return false;}
	
	let start_time = 0;
	let end_time = 0;
	if(typeof data["start_time"]!=0){
		start_time = data["start_time"];
	}

	if(typeof data["end_time"]!=0){
		end_time = data["end_time"];
	}

	if(start_time!=0 && end_time!=0){
		var [insert] = await helpers.db_request('UPDATE _cl_packages SET name=?,sport_no_block=?,country_no_block=?,start_time=?,end_time=? WHERE package=?', 
								[\start_time, end_time, data.package]);
	
	}else{
		var [insert] = await helpers.db_request('UPDATE _cl_packages SET name=?,sport_no_block=?,country_no_block=? WHERE package=?', 
								[\ data.package]);
	}

	
	if (typeof insert['affectedRows']=="undefined" || insert['affectedRows']==0){
		cb("Error edit package!!", 99); return false;
	}
	
	cb("Package updated!", 1);
	
	return "Package updated";
};

var remove_package = async function(data, cb){
	let check_keys = helpers.check_need_key(data,["package"]);
	if (check_keys==false){cb("You have error in fields data!", 99); return false;}
	
	var [insert] = await helpers.db_request('DELETE FROM _cl_packages WHERE package=?', 
								[data.package]);
	
	if (typeof insert['affectedRows']=="undefined" || insert['affectedRows']==0){
		cb("Error remove package!!", 99); return false;
	}
	
	cb("Package removed!", 1);
	
	return "Package removed";
};

var get_list_packages = async function(auth_data, cb){
	var [rows] = await helpers.db_request('SELECT * FROM _cl_packages WHERE uid = ?',[auth_data.uid]);
	if (rows.length==0){cb([]); return false;}
	
	cb(rows, 1)
	
	return "List";
}

module.exports = {	
	"edit_package":edit_package,
	"remove_package":remove_package,
	"get_list_packages":get_list_packages
}