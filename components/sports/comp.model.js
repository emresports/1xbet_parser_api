var app_config = require('app_config');
var helper = require(app_config.root_dir+'/lib/helper');
var flt = require(app_config.root_dir+'/lib/flt');
var evts = require(app_config.root_dir+'/taskers/evts_tasker.js');

var force_data = function(data, lang, pkg_data){
	var sport_no_block = [];
	var show_all_sports = false;
	if (pkg_data['sport_no_block']=="-1"){
		show_all_sports = true;
	}else if (pkg_data['sport_no_block']!=""){
		sport_no_block = pkg_data['sport_no_block'].split('|');
		sport_no_block = sport_no_block.map(item => parseInt(item));
	}
	var country_no_block = [];
	
	if (pkg_data['country_no_block']!=""){
		country_no_block = pkg_data['country_no_block'].split('|');
		country_no_block = country_no_block.map(item => parseInt(item));
	}
	var ret_data = [];
	for(var i=0; i<data.length; i++){
		if(app_config.sports_block.indexOf(parseInt(data[i]["id"]))!=-1){
			continue;
		}
		
		if (show_all_sports==false && sport_no_block.indexOf(parseInt(data[i]["id"]))==-1){
			continue;
		}
		

		delete data[i]["sub"];
		
		if(typeof data[i]["name_"+lang]!="undefined"){
			data[i]["name"] = data[i]["name_"+lang];
		}
		ret_data.push(data[i]);
	}

	ret_data.sort(function(a,b){
		return	a.id - b.id;
	});
	
	return ret_data;
}

module.exports = async function(type, lang, pkg, cb){
	var [rows] = await helper.db_request('SELECT * FROM _cl_packages WHERE package=? LIMIT 0,1',[pkg]);
	if (rows.length==0){cb("Error in you package!",99); return false;}
	
	var lang = lang || "ru";
	var type = helper.str_cap(type); // Live | Line
	
	
	
	let time_edge = "";
	if (type=="Line"){
		time_edge = "&tf=2200000&tz=3";
	}
	var url = app_config.xbet_host+"/"+helper.str_cap(type)++lang_param+time_edge;
	
	var main_filename = app_config.root_dir+"/data/"+app_config.collector_dir+"/"+type.toLowerCase()+"_"+lang+"_main_sports_storage.json";
	var main_cache_filename = app_config.root_dir+"/data/"+app_config.collector_dir+"/cache_"+type.toLowerCase()+"_"+lang+"_main_sports_storage.json";
	
	let now = Math.round(new Date().getTime()/1000);
	if(now>rows[0]['end_time']){
		cb("Your package life has expired!",99);
		return false;
	}
	
	//Проверяем доступные языки
	let need_langs = [];
	if (rows[0]['lang_no_block']!=""){
		need_langs = [...rows[0]['lang_no_block'].split('|'), ...app_config.default_langs];
	}else{
		need_langs = ["ru","en"];
	}
	
	if (need_langs.indexOf(lang)==-1){
		cb("Your package does not contain ["+lang+"] language!",99);
		return false;
	}
	
	let chache_status = await helper.check_cache(main_cache_filename, 80);
	if (chache_status!==false){
		cb(chache_status);
		return true;
	}
	

	
	if(forced_data.length!=0){
		await flt.write(main_cache_filename, JSON.stringify(forced_data));
	}
	cb(forced_data);
	
	return type.toUpperCase();
};