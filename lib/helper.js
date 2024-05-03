var app_config = require('app_config');
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var moment = require('moment');
const dbase  =  require(app_config.root_dir+"/lib/dbase.js");
const flt = require(app_config.root_dir+"/lib/flt.js");

var request = require('request');
var fs = require('fs');

var block_rate = function(data){
	if(typeof data=="undefined" || data==null){
		return [];
	}
	
	for(let i = 0; i<data.length; i++){
		if(typeof data[i]['oc_list']!="undefined"){
			for(let j = 0; j<data[i]['oc_list'].length;j++){				
				data[i]['oc_list'][j]['oc_rate'] = 1;
			}
		}else{
			data[i]['oc_block'] = true;
			data[i]['oc_rate'] = 1;
		}
	}
	
	return data;
}

var str_cap = function(str) {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

var force_default_event_item =  function(event_item){
	if (typeof event_item["TN"]=="undefined"){
		event_item["TN"] = "Part";
	}
	
	if (typeof event_item["GI"]=="undefined"){
		event_item["GI"] = [];
	}
	
	if (typeof event_item["SC"]=="undefined"){
		event_item["SC"] = {};
	}
	
	if (typeof event_item["SC"]["FS"]["S2"]=="undefined"){
		event_item["SC"]["FS"]["S2"] = 0;
	}
	
	if (typeof event_item["SC"]["S"]=="undefined"){
		event_item["SC"]["S"] = [];
	}
	
	if (typeof event_item["SC"]["P"]=="undefined"){
		event_item["SC"]["P"] = null;
	}
	
	if (typeof event_item["SC"]["SS"]=="undefined"){
		event_item["SC"]["SS"] = [];
	}
	
	let score_period = "";
	let score_period_storage = [];
	
	for(let ps = 0; ps<event_item["SC"]["PS"].length; ps++){
		if (typeof event_item["SC"]["PS"][ps]['Value']=="undefined"){
			event_item["SC"]["PS"][ps]['Value'] = {};
		}
		let score_p_one = (typeof event_item["SC"]["PS"][ps]['Value']['S']=="undefined")?0:event_item["SC"]["PS"][ps]['Value']['S1'];
		let score_p_two = (typeof event_item["SC"]["PS"][ps]['Value']['S']=="undefined")?0:event_item["SC"]["PS"][ps]['Value']['S2'];
		score_period_storage[event_item["SC"]["PS"][ps]['Key']-1] = score_p_one+":"+score_p_two;
	}
	
	event_item["SPSSTR"] = score_period_storage.join(";");
	
	if(event_item["SPSSTR"]===""){
		event_item["SPSSTR"] = event_item["SC"]["S1"]+":"+event_item["SC"]["FS"]["S2"];
	}
	
	return event_item;
}

var check_need_key =  function(object, keys){
	for(let i=0; i<keys.length; i++){
		if(typeof object[keys[i]]=="undefined"){
			return false;
		}
	}
	
	return true;
}

var  db_request = async function(sql, params = []) {
	let [rows, fields] = await dbase.execute(sql, params);
	return [rows, fields];
}



var get_new_token =  function(params){
	let now_time = Math.floor(Date.now() / 1000);
	let edge_time = now_time + (60 * 60);
	let usign =  (typeof params["usign"]=="undefined")?md5(JSON.stringify(params)):params["usign"];
	
	return {"auth_token":auth_token, "update_token":update_token}
}

var check_auth = function(token) {
	try {
		var decoded = jwt.verify(token, app_config.jwt_secret);
		if (decoded["exp"]<moment().utc().unix()){
			return false;
		}
	} catch(err) {
		return false;
	}
	
	return decoded;
}

let check_cache = async function(cache_filename, old_time = app_config.xbet_old_time){
	let file_exist = await flt.check_age(cache_filename, old_time);
	
	if (file_exist===true){
		let data_raw = await flt.read(cache_filename);
		if (data_raw===null){return false;}
		let data = [];
		
		try{
			data = JSON.parse(data_raw)
		}catch(e){}
		
		//console.log(data.length);
		if (typeof data.game_id!="undefined"){
			data.length = 1;
		}
		
		if (data.length==0){
			await flt.unlink(cache_filename);
			return false;
		}

		return data;
	}
	return false;
}

var score_normalize = function(score = ""){
    if(score===""){
        return null;
    }

    score = score.replace(/[\s]*\/[0-9\s]+/gi,'')
          .replace(/[\s]*-[\s]*/gi,':')
          .replace(/\([;]+/gi,'(')
          .replace(/[;]+\)/gi,')')
          .replace(/[;]+/gi,';');

    return score;
}

module.exports = {
	"str_cap":str_cap,
	"force_default_event_item":force_default_event_item,
	"check_need_key": check_need_key,
	"db_request": db_request,
	"gen_secret_pass": gen_secret_pass,
	"block_rate": block_rate,
	"score_normalize": score_normalize
};