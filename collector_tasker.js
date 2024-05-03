var app_config = require("app_config");
app_config.root_dir = __dirname;

var flt = require(app_config.root_dir+'/lib/flt');
var menu = require(app_config.root_dir+'/lib/menu_manager');

var force_ru_lang = function(data){
	var save_data = [];

	for(var i=0; i<data.length; i++){
		data[i]["name"] = data[i]["name_ru"];
		for(var j=0; j<data[i]["sub"].length; j++){
			data[i]["sub"][j]["name"] = data[i]["sub"][j]["name_ru"]; 
			
			for(var k=0; k<data[i]["sub"][j]["sub"].length; k++){
				data[i]["sub"][j]["sub"][k]["name"] = data[i]["sub"][j]["sub"][k]["name_ru"];
			}
		}
		
		save_data.push(data[i]);
	}
	
	return save_data;
}

var data_type = "live";

var run = async function(){
	
	let lang = "en";
	let menu_file = app_config.root_dir+"/data/"+app_config.collector_dir+"/menu_"+data_type+"_"+lang+".json";
	let menu_file_ru = app_config.root_dir+"/data/"+app_config.collector_dir+"/menu_"+data_type+"_ru.json";
	let change_type = true;
	let recall_time = 30;
	
	if (await flt.exists(menu_file)==false || (await flt.exists(menu_file)==true && await flt.check_age(menu_file,55)==false)){
		let menu_data = await menu(data_type, lang, true);
		if(menu_data.length>0){
			let menu_data_ru = force_ru_lang(menu_data);
			flt.write(menu_file_ru, JSON.stringify(menu_data_ru));
		}else{
			change_type = false;
			recall_time = 10;
		}
		
	}else{
		
	}
	
	if(change_type){
		data_type = (data_type=="live")?"line":"live";
	}
	setTimeout(function(){
		run();
	}, recall_time*1000);
}

run();