var app_config = require('app_config');
var reader = require(app_config.root_dir+'/lib/reader');
var helper = require(app_config.root_dir+'/lib/helper');

var force_data = function(data, pkg_data){
	var sport_no_block = [];
	var show_all_sports = false;
	if (pkg_data['sport_no_block']=="-1"){
		show_all_sports = true;
	}else if (pkg_data['sport_no_block']!=""){
		sport_no_block = pkg_data['sport_no_block'].split('|');
		sport_no_block = sport_no_block.map(item => parseInt(item));
	}
	var country_no_block = [];
	var show_all_countries = false;
	if (pkg_data['country_no_block']=="-1"){
		show_all_countries = true;
	}if (pkg_data['country_no_block']!=""){
		country_no_block = pkg_data['country_no_block'].split('|');
		country_no_block = country_no_block.map(item => parseInt(item));
	}
	
	var ret_data = [];

	for(var i=0; i<data.length; i++){
		if(app_config.sports_block.indexOf(parseInt(data[i]["id"]))!=-1){
			continue;
		}
		
		if (show_all_sports==false &&  sport_no_block.indexOf(parseInt(data[i]["id"]))==-1){
			continue;
		}

		ret_data.push(data[i]);
	}
	
	
	return ret_data;
}

module.exports = async function(type, lang, pkg, cb){
	var [rows] = await helper.db_request('SELECT * FROM _cl_packages WHERE package=? LIMIT 0,1',[pkg]);
	if (rows.length==0){cb("Error in you package!",99); return false;}
	
	var lang = lang || "ru";
	var type = helper.str_cap(type); // Live | Line
	

	//Проверяем время жизни пакета
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
	
	

	let data = await menu(type, lang);
	let forced_data = force_data(data, rows[0]);
	cb(forced_data);
	
	return type.toUpperCase();
};