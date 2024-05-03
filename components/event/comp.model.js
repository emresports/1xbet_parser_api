var app_config = require('app_config');
var reader = require(app_config.root_dir+'/lib/reader');
var helper = require(app_config.root_dir+'/lib/helper');
var ocrender  =  require(app_config.root_dir+"/lib/render_outcomes");
var stat_names = require(app_config.root_dir+"/data/langs/stat/names.json");
var flt = require(app_config.root_dir+'/lib/flt');

var lv2ln = require(app_config.root_dir+"/lib/lv2ln.js"); 

var force_data = async function(dtype, data, lang, ltype){
	
		let group_columns = [];
		var ret_data = [];
		if (typeof data=="string"){
			try{
				data = JSON.parse(data);
			}catch(e){return ret_data;}
		}
		if (data["Error"]!="" || typeof data["Value"]=="undefined" || typeof data["Value"]==null){
			return ret_data;
		}
		
		let dop = [];
		let chain_dop = [];
			if(typeof data["Value"]["TG"]!="undefined" ){
				dop.push(data["Value"]["TG"]);
				chain_dop.push(data["Value"]["TG"]);
			}
			if(typeof data["Value"]["DI"]!="undefined"){
				dop.push(data["Value"]["DI"]);
			}
			if(typeof data["Value"]["PN"]!="undefined"){
				dop.push(data["Value"]["PN"]);
				chain_dop.push(data["Value"]["PN"]);
			}
			if(typeof data["Value"]["V"]!="undefined"){
				dop.push(data["Value"]["V"]);
				chain_dop.push(data["Value"]["V"]);
			}
			dop = dop.filter(item => item.trim() != "")
			
			
			let oc_list = [];
			let exist = [];
			let finale = (typeof data["Value"]["F"]=="undefined")?false:data["Value"]["F"];
			if (typeof data["Value"]["E"]!="undefined" && typeof data["Value"]["E"].length!="undefined"){
				if(data["Value"]["E"].length==0){
					
				}
				for(let e = 0; e<data["Value"]["E"].length; e++){
					let exp = (typeof data["Value"]["E"][e]["P"]=="undefined")?0:data["Value"]["E"][e]["P"];
					data["Value"]["E"][e]["sportId"] = data["Value"]["SI"];
					
					let oc_name = await ocrender.soft_render(data["Value"]["E"][e], lang);
					let betCode = data["Value"]["E"][e]["G"]+"|"+data["Value"]["E"][e]["T"];
					
					if(app_config.ocblock.outcomes.indexOf(betCode)!=-1){
						continue;
					}

					if(app_config.ocblock.groups.indexOf(""+data["Value"]["E"][e]["G"])!=-1){
						continue;
					}

					if(typeof group_columns["id_"+data["Value"]["E"]]=="undefined"){
						group_columns["id_"+data["Value"]["E"][e]["G"]] = [];
					}
					group_columns["id_"+data["Value"]["E"]].push(data["Value"]["E"][e]["T"]);
					group_columns["id_"+data["Value"]["E"]] = [...new Set(group_columns["id_"+data["Value"]["E"][e]["G"]])];
					
					
					if (oc_name!=null){
						
						let dop_pointer_id  = '';
						if (typeof data["Value"]["E"][e]["PL"]!="undefined" && data["Value"]["E"][e]["PL"]!=null){
							dop_pointer_id = (typeof data["Value"]["E"][e]["PL"]['I']!="undefined")?'|'+data["Value"]["E"][e]["PL"]['I']:'';
						}
						
						let temp_oc = {
							"Eg":oc_name[1],
							"En":oc_name[0],
							"Er":data["Value"]["E"][e]["C"],
							"Esize": exp,
							"Eid":data["Value"]["I"]+"|"+data["Value"]["E"][e]["G"]+"|"+data["Value"]["E"][e]["T"]+"|"+exp+dop_pointer_id,
							"Eb": (typeof data["Value"]["E"][e]["B"]!="undefined" && data["Value"]["E"][e]["B"]==true)?true:false
						};

						if(typeof temp_oc['Er']=="undefined"){
							temp_oc['Er'] = 1;
						}
						
						if (ltype=="list"){
							oc_list.push(temp_oc);
						}else if(ltype=="sub"){
							let ekey = "id_"+data["Value"]["E"][e]["G"];
							
							if (typeof exist[ekey]=="undefined"){
								exist[ekey] = oc_list.length;
								oc_list.push({
									"group_id":data["Value"]["E"][e]["G"],
									"group_name":oc_name[1],
									"columns":1,
									"oc_list":[]
								});
							}
							
							oc_list[exist[ekey]]["columns"] = group_columns[ekey].length;
							oc_list[exist[ekey]]["oc_list"].push(temp_oc);
						}
					}
				}
			}else{
				
			}
			exist = null;

			if(ltype == "sub") {
				oc_list = oc_list.sort((a , b)=>{
					return a.group_id - b.group_id;
				});
			}
			
			data["Value"] = helper.force_default_event_item(data["Value"]);
			
			if(typeof data["Value"]['O1I']=="undefined"){
				data["Value"]['O1I'] = 0;
			}

			if(typeof data["Value"]['O2I']=="undefined"){
				data["Value"]['O2I'] = 0;
			}

			
			let opp_1_icon = (typeof data["Value"]["O1I"]=="undefined")?0:data["Value"]["O1I"];
			let opp_2_icon = (typeof data["Value"]["O2I"]=="undefined")?0:data["Value"]["O2I"];
			opp_1_icon = (typeof data["Value"]["O1IMG"]=="undefined")?opp_1_icon:data["Value"]["O1IMG"][0];
			opp_2_icon = (typeof data["Value"]["O2IMG"]=="undefined")?opp_2_icon:data["Value"]["O2IMG"][0];

			opp_1_icon = opp_1_icon.includes('.png') ? opp_1_icon : opp_1_icon +".png";
			opp_2_icon = opp_2_icon.includes('.png') ? opp_2_icon : opp_2_icon +".png";
			
			let opp_1_id = (typeof data["Value"]["O1I"]=="undefined")?0:data["Value"]["O1I"];
			let opp_2_id = (typeof data["Value"]["O2I"]=="undefined")?0:data["Value"]["O2I"];
			let start = (typeof data["Value"]["S"]=="undefined")?0:data["Value"]["S"];
			
			
			
			
			let pitch = data["Value"]["SC"]["P"];
			if (pitch==1){pitch = opp_1_id;}
			if (pitch==2){pitch = opp_2_id;}
			
			let stat_list = [];
			for (let sti = 0; sti<data["Value"]["SC"]["ST"].length; sti++){
				if (data["Value"]["SC"]["ST"][sti].Key!=0){continue;}
				let sti_value = data["Value"]["SC"]["ST"][sti].Value;
				let tmp_name = (typeof stat_names[lang]=="undefined")?stat_names["en"]:stat_names[lang];
				for(let v = 0; v<sti_value.length; v++){ 
					if(tmp_name[sti_value[v].ID]) {
						stat_list.push({
							"id": sti_value[v].ID,
							"name": tmp_name[sti_value[v].ID],
							"opp1":sti_value[v].S1,
							"opp2":sti_value[v].S2
						});
					}
				}
			}
			
						
			let extra_time = "";
			for (let sts = 0; sts<data["Value"]["SC"]["S"].length; sts++){
				if(data["Value"]["SC"]["S"][sts]["Key"]=="AddTime"){
					extra_time = data["Value"]sts]["Value"];
					break;
				}
			}

			
			let game_ext_desk = "";
			if(typeof data["Value"]["SC"]!="undefined" && typeof data["Value"]["SC"]["CPS"]!="undefined"){
				game_ext_desk = data["Value"]["SC"]["CPS"];
			}

			let period_name = "";
			if (dtype.toLowerCase()=="line"){
				period_name = dtype;
			}else{
				period_name = data["Value"]["SC"]["CP"];
			}
			
			let score = "";
			if (dtype.toLowerCase()=="line"){
				score = 0;
			}else{
				score = {
					"Sf":data["Value"]["SC"]["FS"]["S1"]+":"+data["Value"]["SC"]["FS"]["S2"],
					"Sp":helper.score_normalize(data["Value"]["SPSSTR"]),	
					"Spn":period_name,
					"Se":data["Value"]["SC"]["SS"]["S1"]+":"+data["Value"]["SC"]["SS"]["S2"]
				}
			}
			
			ret_data = {				
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
			if (typeof data["Value"]["PG"]!="undefined"){
				let sub_games = [];
				
				
				for(let i =0; i<data["Value"]["PG"].length; i++){
					let sub_dop = [];	


					if(typeof data["Value"]["PG"][i]["TG"]!="undefined"){
						sub_dop.push(data["Value"]["PG"][i]["TG"]);
					}
					if(typeof data["Value"]["PG"][i]["DI"]!="undefined"){
						sub_dop.push(data["Value"]["PG"][i]["DI"]);
					}
					if(typeof data["Value"]["PG"][i]["PN"]!="undefined"){
						sub_dop.push(data["Value"]["PG"][i]["PN"]);
					}
					if(typeof data["Value"]["PG"][i]["V"]!="undefined"){
						sub_dop.push(data["Value"]["PG"][i]["V"]);
					}
					sub_dop = sub_dop.filter(item => item.trim() != "")

					
					data["Value"]["PG"][i]['O1I'] = data["Value"]['O2I'];
					data["Value"]["PG"][i]['O2I'] = data["Value"]['O2I'];
					data["Value"]["PG"][i]['O1IS'] = data["Value"]['O1IS'];
					data["Value"]["PG"][i]['O2IS'] = data["Value"]['O2IS'];
					data["Value"]["PG"][i]['SI'] = data["Value"]['SI'];
					data["Value"]["PG"][i]['LI'] = data["Value"]['LI'];
					data["Value"]["PG"][i]['S'] = data["Value"]['S'];
					
					lv2ln.force_game(data["Value"]["PG"][i], dtype.toLowerCase());
					
					sub_games.push({
						"Gid": data["Value"]["PG"][i]["I"],
						"Gn": sub_dop.join(",")
					});
				}
				ret_data["Subg"] = sub_games;
			}else{
				ret_data["Subg"] = [];
			}
		
		return ret_data;
	//});
}

module.exports = async function(game_id, type, lang, ltype, pkg, cb){
	var [rows] = await helper.db_request('SELECT * FROM _cl_packages WHERE package=? LIMIT 0,1',[pkg]);
	if (rows.length==0){cb("Error in you package!",99); return false;}
	
	game_id = ""+game_id;
	if(game_id[0]=="0"){
		let tmp_game_id = lv2ln.get_game_id(game_id,type);
		if(tmp_game_id!=null){
			game_id = tmp_game_id;
		}
	}
	
	var lang = lang || "ru";
	var type = helper.str_cap(type); 
	
	var clear_host = app_config.xbet_host.replace("http://","").replace("https://","");
	var url = {
		host: clear_host,
		path: "/"+helper.str_cap(type)+game_id+"&lng="+lang,
		agent: false
	}

	var main_filename = app_config.root_dir+""+app_config.collector_dir+"/"+type.toLowerCase()+"_"+lang+"_"+game_id+"_storage.json";
	var main_cache_filename = app_config.root_dir+""+app_config.collector_dir+"/cache_"+type.toLowerCase()+"_"+lang+"_"+game_id+"_"+ltype+"_storage.json";
	
	
	let now = Math.round(new Date().getTime()/1000);
	if(now>rows[0]['end_time']){
		cb("Your package life has expired!",99);
		return false;
	}
	
	
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
	
	let chache_status = await helper.check_cache(main_cache_filename);
	if (chache_status!==false){cb(chache_status); return true;}
	
	reader(main_filename, url, async function(data){
		if (data!=""){
			let forced_data = await force_data(type, data, lang, ltype);
			
			if (typeof forced_data.game_id!="undefined"){
				data.length = 1;
			}
			if(forced_data.length!=0){
				await flt.write(main_cache_filename, JSON.stringify(forced_data));
			}
			
			cb(forced_data);
		}else{
			chache_status = await helper.check_cache(main_cache_filename, app_config.xbet_old_time+20);
			
			if (chache_status===false){//cb([]);
				chache_status = await helper.check_cache(main_cache_filename, app_config.xbet_old_time+120);
				
				if (chache_status===false){cb([]);}else{
					
					await flt.write(main_cache_filename, JSON.stringify(chache_status));
					cb(chache_status);
				}
			}else{cb(chache_status);}
		}
	});
	
	
	return type.toUpperCase();
};