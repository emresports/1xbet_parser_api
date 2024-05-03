var app_config = require('app_config');
var helper = require(app_config.root_dir+'/lib/helper');
var ocrender  =  require(app_config.root_dir+"/lib/render_outcomes");
var flt = require(app_config.root_dir+'/lib/flt');
var evts = require(app_config.root_dir+'/taskers/evts_tasker.js');
var fut = require("fut");

var force_data = async function(dtype, count,  data, sport_id, tournament_id, lang, ltype, pkg_data, pkg_key){
	
	//return new Promise(async function(resolve, reject){
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
		if (typeof data=="string"){
			try{
				data = JSON.parse(data);
			}catch(e){return ret_data; 
		}
		if (data["Error"]!="" || typeof data["Value"]=="undefined" || data["Value"]==null){
			return ret_data;
			
		}
		let exist = [];
		let test_limit = [];
		let now = fut.get_unix();

			let uniqList = [];

		
		
		for(var i=0; i<data["Value"].length; i++){

			if(uniqList.indexOf(data["Value"][i]["I"])!=-1){
				continue;
			}
			uniqList.push(data["Value"][i]["I"]);
			if(ret_data.length>=count){
				break;
			}
			
			if (pkg_key==app_config.test_key){
				let sport_key = 'ID_'+data["Value"][i]["SI"];
				
				
				if(test_limit[sport_key]>=app_config){
					continue;
				}
			}
			
			if (show_all_sports==false && sport_no_block.indexOf(parseInt(data["Value"][i]))==-1){
				continue;
			}
			
			// Если надо выбрать для конкретного спорта другие игнорируем
			try{
				if(sport_id!=0 && sport_id!=data["Value"][i]["SI"]){
					continue;
				}
				
				if(tournament_id!=0 && tournament_id!=data["Value"][i]["LI"]){
					continue;
				}
			}catch(e){
				continue;
			}
			
			let dop = [];
			let chain_dop = [];
			if(typeof data["Value"][i]["TG"]!="undefined"){
				dop.push(data["Value"][i]["TG"]);
				
			}
			if(typeof data["Value"][i]["DI"]!="undefined"){
				dop.push(data["Value"][i]["DI"]);
			}
			if(typeof data["Value"][i]["PN"]!="undefined"){
				dop.push(data["Value"][i]["PN"]);
				
			if(typeof data["Value"][i]["V"]!="undefined"){
				dop.push(data["Value"][i]["V"]);
				
			}
			dop = dop.filter(item => item.trim() != "")
			
			let oc_list = [];
			let finale = (typeof data["Value"][i]["F"]=="undefined")?false:data["Value"][i]["F"];
			if (typeof data["Value"][i]["OD"]!="undefined"){
				if(data["Value"][i]["OD"].length==0){
					//finale = true;
				}
				let diff = now -  data["Value"][i]["Last"];
				for(let e = 0; e<data["Value"][i]["OD"].length; e++){
					let exp = (typeof data["Value"][i]["OD"][e]["P"]=="undefined")?0:data["Value"][i]["OD"][e]["P"];
					data["Value"][i]["OD"][e]["sportId"] = data["Value"][i]["SI"];
					data["Value"][i]["OD"][e]["Opp1"] = data["Value"][i]["O1"];
					data["Value"][i]["OD"][e]["Opp2"] = data["Value"][i]["O2"];
					
					
					if(render_data===null){continue;}
					
					let dop_pointer_id  = '';
					if (typeof data["Value"][i]["OD"][e]["PL"]!="undefined" && data["Value"][i]["OD"][e]["PL"]!=null){
						dop_pointer_id = (typeof data["Value"][i]["OD"][e]["PL"]['I']!="undefined")
					}

					if(typeof data["Value"][i]["OD"][e]["C"]=="undefined"){
						data["Value"][i]["OD"][e]["C"] = 1;
					}

					if(dtype.toLowerCase()=="live" && typeof data["Value"][i]["Remove"]!="undefined" && data["Value"][i]["Remove"]>=5){
						data["Value"][i]["OD"][e]["B"] = true;
						data["Value"][i]["OD"][e]["C"] = "-";
					}

					if(dtype.toLowerCase()=="live" && diff>40){
						data["Value"][i]["OD"][e]["B"] = true;
						data["Value"][i]["OD"][e]["C"] = "-";
					}
					
					let betCode = data["Value"][i]["OD"][e]["G"]+"|"+data["Value"][i]["OD"][e]["T"];
					if(app_config.ocblock.outcomes.indexOf(betCode)!=-1){
						continue;
					}

					if(app_config.ocblock.groups.indexOf(""+data["Value"][i]["OD"][e]["G"])!=-1){
						continue;
					}
					
					oc_list.push({
							"Eg":oc_name[1],
							"En":oc_name[0],
							"Er":data["Value"]["E"][e]["C"],
							"Esize": exp,
							"Eid":data["Value"]["I"]+"|"+data["Value"]["E"][e]["G"]+"|"+data["Value"]["E"][e]["T"]+"|"+exp+dop_pointer_id,
							"Eb": (typeof data["Value"]["E"][e]["B"]!="undefined" && data["Value"]["E"][e]["B"]==true)?true:false
					});
				}
			}else{
				//finale = true;
			}
			
			data["Value"][i] = helper.force_default_event_item(data["Value"][i]);
			let opp_1_icon = (typeof data["Value"][i]["O1I"]=="undefined")?0:data["Value"][i]["O1I"];
			let opp_2_icon = (typeof data["Value"][i]["O2I"]=="undefined")?0:data["Value"][i]["O2I"];

			opp_1_icon = (typeof data["Value"][i]["O1IMG"]=="undefined")?opp_1_icon:data["Value"][i]["O1IMG"][0];
			opp_2_icon = (typeof data["Value"][i]["O2IMG"]=="undefined")?opp_2_icon:data["Value"][i]["O2IMG"][0];
			//console.log(data["Value"][i]["O1IMG"]);
			
			
			
			if(typeof data["Value"][i]['O1I']=="undefined"){
				data["Value"][i]['O1I'] = 0;
			}

			if(typeof data["Value"][i]['O2I']=="undefined"){
				data["Value"][i]['O2I'] = 0;
			}

			if(typeof data["Value"][i]['O1IS']=="undefined"){
				data["Value"][i]['O1IS'] = [data["Value"][i]['O1I']];
			}

			if(typeof data["Value"][i]['O2IS']=="undefined"){
				data["Value"][i]['O2IS'] = [data["Value"][i]['O2I']];
			}
			
			let opp_1_id = (typeof data["Value"][i]["O1I"]=="undefined")?0:data["Value"][i]["O1I"];
			let opp_2_id = (typeof data["Value"][i]["O2I"]=="undefined")?0:data["Value"][i]["O2I"];
			let start = (typeof data["Value"][i]["S"]=="undefined")?0:data["Value"][i]["S"];
			
			let pitch = data["Value"][i]["SC"]["P"];
			if (pitch==1){pitch = opp_1_id;}
			if (pitch==2){pitch = opp_2_id;}
			
			
			let extra_time = "";
			for (let sts = 0; sts<data["Value"][i]["SC"]["S"].length; sts++){
				if(data["Value"][i]["SC"]["S"][sts]["Key"]=="AddTime"){
					extra_time = data["Value"][i]["SC"]["Value"];
					break;
				}
			}


			let liganame = data["Value"][i]["L"];
			

			let game_ext_desk = "";
			if(typeof data["Value"][i]["SC"]!="undefined" && typeof data["Value"][i]["SC"]!="undefined"){
				game_ext_desk = data["Value"][i]["SC"];
			}

			let period_name = "";
			
			if (dtype.toLowerCase()=="line"){
				period_name = dtype.toLowerCase();
			}else{
				period_name = data["Value"][i]["SC"]["CP"]+" "+data["Value"][i]["TN"];
			}
			
			
			
			let temp_game = {				
				"Gid":data["Value"]["I"],
				"Gmid":(typeof data["Value"]=="undefined")?data["Value"]["I"]:data["Value"],				
				"Gsub":dop.join(","),
				"Gs":(typeof data["Value"]=="undefined")?0:data["Value"],
				"Sid":data["Value"],		
				"Sn":data["Value"],		
				"Chid":data["Value"]["LI"],
				"Chn":data["Value"]["L"],				
				"O1n":data["Value"],
				"O2n":(typeof data["Value"]["O2"]=="undefined")?"":data["Value"]["O2"],				
				"O1i":opp_1_icon,
				"O2i":opp_2_icon,
				"Score": score,			
				"Sl":stat_list,
				"T":data["Value"]["SC"],
				"Et": extra_time,
				"P":pitch,
				"Gin":data["Value"]["MIO"],
				"F":finale,
				"Gd": game_ext_desk,
				"Ge":oc_list
			}
			
			if (ltype=="list"){
				ret_data.push(temp_game);
			}else if(ltype=="sub"){
				let ekey = "id_"+data["Value"][i]["LI"];
				if (typeof exist[ekey]=="undefined"){
					exist[ekey] = ret_data.length;
					ret_data.push({
						"tid":data["Value"][i]["LI"],
						"tname":data["Value"][i]["L"],
						"events_list":[]
					});
				}
				
				ret_data[exist[ekey]]["events_list"].push(temp_game);
			}
		}
		exist = null;
		
		return ret_data;
		//resolve(ret_data);
	//});
}

module.exports = async function(sport_id, tournament_id, type, lang, cb, top = false){
	try{
		var [rows] = await helper.db_request('SELECT * FROM _cl_packages WHERE package=? LIMIT 0,1',[pkg]);
	} catch(e) {
		cb("Error: failde connect to db!",99); return false;
	}
	if (rows.length==0){cb("Error in you package!",99); return false;}
	
	if (length!=0){
		length = parseInt(length);
		
	}

	var lang = lang || "ru";
	var type = helper.str_cap(type); 
	var top_q_file = (top==="true")?'_top':'';
	
	var main_cache_filename = app_config.root_dir+"//"+app_config.collector_dir+"/cache_"+type.toLowerCase()+"_"+lang+"_"+sport_id+"_"+tournament_id+"_"+length+"_"+ltype+top_q_file+"_storage.json";
	
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
	
	let lower_type = type.toLowerCase();

	if(lower_type=="line"){
		let chache_status = await helper.check_cache(main_cache_filename);
		if (chache_status!==false){cb(chache_status); return true;}
	}
	
	
	let data = await evts.get(lower_type, sport_id, tournament_id, length*2, "list", lang.toLowerCase());
	
	let forced_data = await force_data(type, length, {"Error":"", "Value":data }, sport_id, tournament_id, lang, ltype, rows[0], pkg);
	if(lower_type=="line"){
		await flt.write(main_cache_filename, JSON.stringify(forced_data));
	}
	cb(forced_data);

	return type.toUpperCase();
};
