var app_config = require('app_config');
//app_config.root_dir = __dirname;
var helper = require(app_config.root_dir+"/lib/helper.js");
var flt = require(app_config.root_dir+"/lib/flt.js");
var https = require("https");


var run_request = async function(url){
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            res.setEncoding("utf8");
            let body = "";
            
            res.on("data", data => {
                body += data;
            });
            
            res.on("end", async function() {
                body = body.trim();
                
                resolve(body);
            });
            
            res.on('error', function(e) {
                console.log('Ошибка обращения к хбет: ', e);
                resolve("");
            });
        }).on('error', function(e) {
            console.log('Ошибка обращения к хбет: ', e);
            resolve("");
        });
    });
}

var simple_data_force = function(data){
	let ret_data = [];
    if (typeof data=="string"){
		try{
			data = JSON.parse(data);
		}catch(e){return ret_data;}
    }
    
	if (data["Error"]!="" || typeof data["Value"]=="undefined" || typeof data["Value"]==null){
		return ret_data;
    }
    let sports = []; 
    
    for(var i=0; i<data["Value"].length; i++){
        if (typeof data["Value"][i]["IN"]!="undefined"){
            continue;
        }

        let sport_id = parseInt(data["Value"][i]["I"]);
        if (sport_id>220){continue;}

        if(app_config.sports_block.indexOf(sport_id)!=-1){
			continue;
        }
        
        sports.push(data["Value"][i]["I"]);
    }

    sports.sort((a,b) => {
        return a - b;
    });

    return sports;
}

var full_data_force = function(data){
    let ret_data = [];

    if (typeof data=="string"){
		try{
			data = JSON.parse(data);
		}catch(e){return ret_data;}
    }
    
	if (data["Error"]!="" || typeof data["Value"]=="undefined" || typeof data["Value"]==null){
		return ret_data;
    }
    
    for(let i=0; i<data["Value"].length; i++){
        if(app_config.sports_block.indexOf(parseInt(data["Value"][i]["I"]))!=-1){
			continue;
        }

        if(typeof data["Value"][i]["L"]=="undefined"){continue;}
        
       

        if(typeof data["Value"][i]["L"]!="undefined"){
            let exist_country = []
            let last_index = ret_data.length - 1;
            ret_data[last_index]["sub"] = [];

            for(let j = 0; j<data["Value"][i]["L"].length; j++){
                let country_en_name = (typeof data["Value"][i]["L"][j]["CE"]!="undefined")?data["Value"][i]["L"][j]["CE"]:data["Value"][i]["L"][j]["CN"];
                let country_ru_name = (typeof data["Value"][i]["L"][j]["CR"]!="undefined")?data["Value"][i]["L"][j]["CR"]:data["Value"][i]["L"][j]["CN"];
                
                let liga_en_name = (typeof data["Value"][i]["L"][j]["LE"]!="undefined")?data["Value"][i]["L"][j]["LE"]:data["Value"][i]["L"][j]["L"];
                let liga_ru_name = (typeof data["Value"][i]["L"][j]["LR"]!="undefined")?data["Value"][i]["L"][j]["LR"]:data["Value"][i]["L"][j]["L"];
                
               

                ret_data[last_index]["counter"] += data["Value"][i]["L"][j]["GC"];
                

				if (data["Value"][i]["L"][j]["CI"]==0 || typeof data["Value"][i]["L"][j]["CI"]=="undefined"){
                    data["Value"][i]["L"][j]["CI"] = 225;
                    
                }
				
				let country_key = "CID_"+data["Value"][i]["L"][j]["CI"];

                if (typeof exist_country[country_key]=="undefined"){
                    ret_data[last_index]["sub"].push({
                        "id":data["Value"][i]["L"][j]["CI"],
                        "name":data["Value"][i]["L"][j]["CN"],
                        "name_ru":country_ru_name,
                        "name_en":country_en_name,
                        "sport_id":data["Value"][i]["I"],
                        "counter":data["Value"][i]["L"][j]["GC"],
                        "sub":[{
                            "id":data["Value"][i]["L"][j]["LI"],
                            "name":data["Value"][i]["L"][j]["L"],
                            
                        }]
                    });

                    exist_country[country_key] = ret_data[last_index]["sub"].length - 1;
                }else{
                    ret_data[last_index]["sub"][exist_country[country_key]]["counter"] += data["Value"][i]["L"][j]["GC"];
                    ret_data[last_index]["sub"][exist_country[country_key]]["sub"].push({
                        "id":data["Value"][i]["L"][j]["LI"],
                        "name":data["Value"][i]["L"][j]["L"],
                        "name_ru":liga_ru_name,
                        "name_en":liga_en_name,
                        
                    });
                }
            }
        }

    }
    return ret_data;
}

var menu_collector_run = async function(data_type = "Live", sports = [], lang = "ru", request_type = "simple"){
   

    data_type = helper.str_cap(data_type);

    let params = [];

    if (sports.length>0){
        sports = [... new Set(sports)];
        params.push("sports="+sports.join(","));
    }

    if (lang!="ru"){
		params.push("lng="+lang);
	}

    if (data_type=="Line"){
        params.push("tf=2200000&tz=3");
    }

    if (request_type=="full"){
        params.push("withCountries=true");
    }
    params.push("partner=25&group=14");

    var url = app_config.xbet_host+"/"+data_type+params.join("&");
    
    if (request_type=="simple"){
        let simple_data = await run_request(url);
        let need_sport = simple_data_force(simple_data);
        return await menu_collector_run(data_type, need_sport, lang, "full");
    }else if (request_type=="full"){
        let full_data = await run_request(url);
        let ready_data = full_data_force(full_data);
        return ready_data;
    }
}

let get_menu = async function(data_type, lang, force = false) {
    data_type = data_type.toLowerCase();

    let file_time_edge = (data_type=="live")?60:480;
    let menu_file_lock = app_config.root_dir+"/data/"+app_config.collector_dir+"/lock_menu_"+data_type+"_"+lang+".json";
    
    if (force == false && await flt.check_age(menu_file, file_time_edge)==true ||  (await flt.exists(menu_file_lock) && await flt.check_age(menu_file, file_time_edge + 60 )==true)){
        let fule_menu_from_file = ["-1"];
        try{
            fule_menu_from_file = JSON.parse(await flt.read(menu_file));
        }catch(e){}
        return fule_menu_from_file;
    }

    await flt.write(menu_file_lock, "");
    let full_menu = await menu_collector_run(data_type, [], lang);
    
    if (full_menu.length!=0){
        flt.write(menu_file, JSON.stringify(full_menu));
    }
    flt.unlink(menu_file_lock, "");
    return full_menu;
};



module.exports = get_menu;