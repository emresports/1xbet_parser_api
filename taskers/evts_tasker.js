var fut = require("fut");
var app_config = require("app_config");

/*
*   Функция для загрузки данных
*
*   @param data_type {string} - Тип загружаемых данных
*   @param champs {string} - Список чемпионатов
*
*   @return {array} -  Массив объектов
*/
var load_list = async function(data_type, champs = "", events = true, lang = "en", attemps = 2){
    let in_data_type = data_type;
    let in_champs = champs; 
    let in_events = events;
    let in_lang = lang;
    let in_attemps = attemps;

    let url = null;
    let evts_param = "";
    lang = (lang!="ru")?"&lng="+lang:'';

    switch(data_type){
        case "line":
            evts_param = (events===true)?"&mode=4":"";
            url = host1x;
        break;
        case "line_champs":
            url = host1xline;
        break;
        case "live":
            evts_param = (events===true)?"&mode=4":"";
            url = host1xlive;
        break;
        case "live_champs":
            url = '/Live/GetChamps';
        break;

        default:
            url = host1x;
        break;
    }
   
    let loaded_data = fut.jparse(await fut.send_request({
        "host": "betandyou2.com",
        "path": url,
        "time": 4.5,
        "headers":{
            "Accept":"*/*",
            "Accept-Encoding": "deflate, identity"
        }
    }));

    if(loaded_data==null || loaded_data['Error']!=""){
       

        if(attemps>0){
            attemps--;
            return await load_list(in_data_type, in_champs, in_events, in_lang, attemps);
        }else{
            return [];
        }
    }

    if(typeof loaded_data['Value']=="undefined" || loaded_data['Value']===null){
       
        if(attemps>0){
            attemps--;
            return await load_list(in_data_type, in_champs, in_events, in_lang, attemps);
        }else{
            return [];
        }
    }

    return loaded_data['Value'];
}

/*
*   Функция для генерации списков чемпионатов
*
*   @param raw_list {array} - Список чемпионатов
*   @param limit {integer} - Лимит, сколько чемпионатов в одной ячейке массива
*
*   @return {array} -  Массив объектов чемпионатов
*/


let ligaMemory = {};
var gen_champs_list_str = async function(raw_list, limit = 50){
    
    raw_list = raw_list.sort((a, b)=>{
        return b.SI - a.SI;
    });

    let gameCounter = 0;
    let index = 0;
    let champsSlices = [];
    let now = Math.round((+new Date())/1000);

    for(let key in ligaMemory){
        let timeDiff = now - ligaMemory[key]["timestamp"];
        if(timeDiff>120){
            delete ligaMemory[key];
        }
    }

    for(let i = 0; i<raw_list.length; i++){
        if(typeof raw_list[i]["GC"]!="undefined"){
            liga[raw_list[i]["LI"]] = {
                "timestamp": Math.round((+new Date())/1000),
                "GC": raw_list[i]["GC"]
            };
        }else{
            if(typeof liga[raw_list[i]["LI"]]!="undefined"){
                raw_list[i]["GC"] = ligaMemory[raw_list[i]["LI"]]["GC"];
            }else{
                raw_list[i]["GC"] = 5;
            }
        }
        let tmpCounter = gameCounter + raw_list[i]["GC"];
        if(tmpCounter>50){
            index++;
            gameCounter = raw_list[i]["GC"];
        }else{
            gameCounter = gameCounter + raw_list[i]["GC"];
        }

        if(typeof champsSlices[index]=="undefined"){
            champsSlices[index] = [];
        }

        champsSlices[index].push(raw_list[i]["LI"]);
    }

    for(let i = 0; i<champsSlices.length; i++){
		if(typeof champsSlices[i]=="undefined"){
			champsSlices[i] = [];
		}
        champsSlices[i] = champsSlices[i].sort((a, b)=>{
            return a - b;
        });
    }
    //console.log(champsSlices);

    return champsSlices;
    
var generate_menu = function(event){
    let ret_data = {};

    if(app_config.sports_block.indexOf(parseInt(event["I"]))!=-1){
        return null;
    }

    if(typeof event["L"]=="undefined"){
        return null;
    }

    let country_en_name = (typeof event["CE"]!="undefined")?event["CE"]:event["CN"];
    let country_ru_name = (typeof event["CR"]!="undefined")?event["CR"]:event["CN"];
    
    let liga_en_name = (typeof event["LE"]!="undefined")?event["LE"]:event["L"];
    let liga_ru_name = (typeof event["LR"]!="undefined")?event["LR"]:event["L"];
    
    
    ret_data = [
        {
            "id":event["SI"],
            "name":event["SN"],
            "name_ru":(typeof event["SR"]!="undefined")?event["SR"]:event["SN"],
            "name_en":(typeof event["SE"]!="undefined")?event["SE"]:event["SN"],
            "counter": 0,
            "sub":[]
        },
        {
            "id":event["COI"],
            "name":event["CN"],
            "name_ru":country_ru_name,
            "name_en":country_en_name,
            "sport_id":event["SI"],
            "counter":0,
            "sub":[]
        }
    ];
    
    for(let key in event["Langs"]){
        if(typeof event["Langs"][key]["SN"]!="undefined"){
            ret_data[0]["name_"+key] = event["Langs"][key]["SN"];
        }
        if(typeof event["Langs"][key]["CN"]!="undefined"){
            ret_data[1]["name_"+key] = event["Langs"][key]["CN"];
        }
        if(typeof event["Langs"][key]["L"]!="undefined"){
            ret_data[2]["name_"+key] = event["Langs"][key]["L"];
        }
    }
    
   
    return ret_data;
}

/*
*   Функция для установки поинтеров на собития
*
*   @param events {array} - Список чемпионатов
*   @param tmp {array} - Лимит, сколько чемпионатов в одной ячейке массива
*
*   @return {array} -  Массив объектов чемпионатов
*/
var set_pointers = function(events, tmp, type = "live", mode = "load"){
    let last = fut.get_unix();
    if(typeof tmp["pointers"]["S0"]==="undefined"){
        tmp["pointers"]["S0"] = [];
    }

    if(typeof tmp["pointers"]["KEYS"]==="undefined"){
        tmp["pointers"]["KEYS"] = [];
    }

    if(typeof tmp["pointers"]["S0"]["C0"]==="undefined"){
        tmp["pointers"]["S0"]["C0"] = [];
    }
    let langs_need_champs_exist = [];
    
	for(let i = 0; i<events.length; i++){
        if(typeof events[i]['SC']!="undefined" 
            && typeof events[i]['SC']["CPS"]!="undefined"
            && events[i]['SC']["CPS"]=="Game finished"){
            continue;
        }
        let index = tmp["evts"].length;

        // Проверяем чтобы были ИД оппонентов
        if(typeof events[i]['O1']=="undefined"){
            events[i]['O1I'] = 0;
        }

        if(typeof events[i]['O2I']=="undefined"){
            events[i]['O2I'] = 0;
        }

        if(typeof events[i]['O1S']=="undefined"){
            events[i]['O1IS'] = [events[i]['O1I']];
        }

        if(typeof events[i]['O2S']=="undefined"){
            events[i]['O2IS'] = [events[i]['O2I']];
        }
        // Проверяем чтобы были ИД оппонентов

        // Проверяем чтобы были доп. названия событий
        if(typeof events[i]["P"]=="undefined"){
            events[i]["EOP"] = "#";
        }else{
            events[i]["EOP"] = events[i]["P"];
        }

        if(typeof events[i]["TI"]=="undefined"){
            events[i]["EOTI"] = "#";
        }else{
            events[i]["EOTI"] = events[i]["TI"];
        }
        
        if(typeof events[i]["IV"]=="undefined"){
            events[i]["EOIV"] = "#";
        }else{
            events[i]["EOTI"] = events[i]["IV"];
        }
        // Проверяем чтобы были доп. названия событий

        // Добавляем все ИД оппонетов в один массив, чтобы отсортировать
        events[i]['OPPIS'] = events[i]['O1IS'].concat(events[i]['O2IS']);
        events[i]['OPPIS'].sort();

        let game_chain_abc = [
            events[i]['SI'],
            //game['LI'],
            ...events[i]['OPPIS'],
            events[i]["EVOP"],
            events[i]["EVOTI"],
            events[i]["EVOIV"]
        ];

        let game_chain_abc_str = game_chain_abc.join("-");

        if(mode!="restore"){
           
            if (typeof events[i]["CI"]!="undefined" && events[i]["CI"]!=0){
                tmp['alive']["CI"+events[i]["CI"]] = index;
            }
        }else{
            if (typeof tmp['alive']["CI"+events[i]["CI"]]!="undefined" && type=="line"){
                
                let finded_index = tmp['alive']["CI"+events[i]["CI"]];
                if(typeof events[i]["Langs"]!="undefined"){
                    tmp['evts'][finded_index]["Langs"] = events[i]["Langs"];
                }
                
                continue;
            

            
        } 

        tmp['alive'][game_chain_abc_str] = true;

        if(typeof events[i]['Last']=="undefined"){
            events[i]['Last'] = last;
        }

        if(typeof events[i]['Remove']=="undefined"){
            events[i]['Remove'] = 0;
        }else{
            events[i]['Remove'] += 1;
        }

        if(typeof events[i]['Langs']=="undefined"){
            events[i]['Langs'] = {};
        }

        let evts_index = list[type]["pointers"]["KEYS"]["I"+events[i]['I']];
        
        if(typeof list[type]["evts"][evts_index]!="undefined"){
            events[i]['Langs'] = list[type]["evts"][evts_index]['Langs'];
        }

        if(typeof events[i]['Langs']["ru"]==="undefined" && typeof langs_need_champs_exist['I'+events[i]['LI']]=="undefined"){
            tmp["langs_need_champs"].push({"LI": events[i]['LI']});
            langs_need_champs_exist['I'+events[i]['LI']] = true;
        }

        if(typeof list[type]["pointers"]["KEYS"]["I"+events[i]['I']]!="undefined"){
            delete list[type]["pointers"]["KEYS"]["I"+events[i]['I']];
        }

        
        if(type=="live" && events[i]['Remove']>=30){
            continue;
        }

        if(type=="line" && events[i]['Remove']>=5){
            continue;
        }

        if(mode=="restore" && type=="line" && events[i]['S']<(last+60)){
            //continue;
        }

        let menu_item = generate_menu(events[i]);
       
        let sport_key = 'I'+menu_item[0]['id'];
        if(typeof tmp['exist'][sport_key]=="undefined"){
            tmp['exist'][sport_key] = tmp['menu'].length;
            tmp['menus'].push(menu_item[0]);
        }

        let country_key = 'I'+menu_item[0]['id']+"_"+menu_item[1]['id'];
        if(typeof tmp['exists'][country_key]=="undefined"){
            tmp['exists'][country_key] = tmp['menu'][tmp['exists'][sport_key]].sub.length;
            tmp['menus'][tmp['exists'][sport_key]].sub.push(menu_item[1]);
        }

        let tournament_key = 'I'+menu_item[0]['id']+"_"+menu_item[1]['id']+"_"+menu_item[2]['id'];
        if(typeof tmp['exists'][tournament_key]=="undefined"){
            tmp['exists'][tournament_key] = tmp['menu'][tmp['exists'][sport_key]].sub[tmp['exists'][country_key]].sub.length;
            tmp['menus'][tmp['exists'][sport_key]].sub[tmp['exists'][country_key]].sub.push(menu_item[2]);
        }

        tmp['menu'][tmp['exists'][sport_key]].counter++;
        tmp['menu'][tmp['exists'][sport_key]].sub[tmp['exists'][country_key]].counter++;
        tmp['menu'][tmp['exists'][sport_key]].sub[tmp['exists'][country_key]].sub[tmp['exists'][tournament_key]].counter++;

        tmp["pointers"]["KEY"]["I"+events[i]['I']] = index;
        tmp["pointers"]["langs"]["I"+events[i]['I']] = index;
        tmp["evts"].push(events[i]);
        tmp["pointers"]["S0"]["C0"].push(index);

		if(typeof tmp["pointer"]["S0"]["C"+events[i]['LI']]=="undefined"){
			tmp["pointers"]["S0"]["C"+events[i]['LI']] = [];
		}
		tmp["pointers"]["S0"]["C"+events[i]['LI']].push(index);
		
		if(typeof tmp["pointer"]["S"+events[i]['SI']]=="undefined"){
			tmp["pointers"]["S"+events[i]['SI']] = [];
		}
		
		if(typeof tmp["pointer"]["S"+events[i]['SI']]["C0"]=="undefined"){
			tmp["pointers"]["S"+events[i]['SI']]["C0"] = [];
		}
		
		if(typeof tmp["pointers"]["S"+events[i]['SI']]["C"+events[i]['LI']]=="undefined"){
			tmp["pointer"]["S"+events[i]['SI']]["C"+events[i]['LI']] = [];
		}
		
		tmp["pointers"]["S"+events[i]['SI']]["C0"].push(index);
		tmp["pointers"]["S"+events[i]['SI']]["C"+events[i]['LI']].push(index);
    }
    langs_need_champs_exist = null;
    return tmp;
};

/*
*   Функция для взятие списка меню
*
*   @param events {array} - Список событий
*   @param lang {string} - Язык который надо выгрузить
*   @param type {string} - Тип обрабатываемых данных
*   @param champs_dic {array} - Список чемпионатов,в формате ключ ид.
*
*   @return {object} - Объект с чемпионтами, которые надо догрузить
*/
var gen_lang_list = function(events, lang, type = "live", champs_dic = []){
    for(let i = 0; i<events.length; i++){
        if(typeof champs_dic['I'+events[i]['LI']]!="undefined"){
            delete champs_dic['I'+events[i]['LI']];
        }
        let need_lang = {};

        for(let j = 0; j<lang_key_list.length; j++){
            let key = lang_key_list[j];
            if(typeof events[i][key]!="undefined"){
                need_lang[key] = events[i][key];
            }
        }
        
        if(typeof list[type]["pointe"]["langs"]["I"+events[i]['I']]!="undefined"){
            let evts_index = list[type]["pointers"]["langs"]["I"+events[i]['I']];

            if(typeof list[type]["evt"][evts_index]!="undefined"){
                list[type]["evt"][evts_index]['Langs'][lang] = need_lang;
            }
        }
    }
    
    let need_champs_list = [];
    for(let key in champs_dic){
        need_champs_list.push({"LI": champs_dic[key]});
    }
    
    return {"ncl": need_champs_list};
}

/*
*   Функция для взятие списка меню
*
*   @param type {string} - Тип обрабатываемых данных
*   @param champs {array} - Список чемпионатов
*
*   @return {void} - Ничего не возвращает
*/
var force_lang_list = async function(type, champs, only_ext = false){
    if(champs.length==0){
        return false;
    }
    for(let key in list[type]["langs_tasks"]){
        return false;
    }

    

    let str_list_page_len = (type==="live")?50:100;
    let champs_dic = [];

    for(let i = 0; i<champs.length; i++){
        champs_dic["I"+champ[i]["LI"]] = champs[i]["LI"];
    }

    for(let l = 0; l<need_langs.length; l++){
        let need_lang = need_langs[l];
        list[type]["langs_tasks"][need_lang] = true;
        (async function(lang){
            let nlc_data = [];
            if(only_ext===false){
                let evnets_list = await load_list(type, "", false, lang);
                let {ncl} = gen_lang_list(evnets_list, lang, type, champs_dic);
                nlc_data = ncl;
            }else{
                nlc_data = champs;
            }
            
            let str_list = await gen_champs_list_str(nlc_data, str_list_page_len);
            let slist_len = str_list.length; // str_list.length

            for(let i = 0; i<slist_len; i++){ 
                load_list(type, "champs="+str_list[i]+"&", false, lang).then(function(data){
                    gen_lang_list(data, lang, type);
                    delete list[type]["langs_tasks"][lang];
                });
            }
        })(need_lang);
    }
}

var counter_force_langs = [];
var tasks_force_langs = {};
var force_langs = async function(type, lang = "ru", champs = "", task = "a+"){
    if (task=="" && tasks_force_langs[lang]===true){
        return false;
    }
    tasks_force_langs[lang] = true;

    if(typeof counter_force_langs[lang]=="undefined"){
        counter_force_langs[lang] = 0;
    }

    let games = [];
    if(counter_force_langs[lang]<1 && champs==""){
        
        counter_force_langs[lang]++;
        games = await load_list(type, champs, false, lang);
    }else{
        
        if(champs=="" && counter_force_langs[lang]<1){
            games = await load_list(type, champs, false, lang);
           
        }else if(champs!=""){
           
            games = await load_list(type, champs, false, lang);
        }
        
    }
    
    let str_list_page_len = (type==="live")?50:100;
    let key_list = {};

    

    for(let i = 0; i<games.length; i++){
        key_list[games[i]['I']] = games[i];
    }

    let need_ligas = [];
    let exist = [];
    for(let i = 0; i<list[type]["evts"].length; i++){
        let game_id = list[type]["evts"][i]['I'];
        let liga_id = list[type]["evts"][i]['LI'];

        if(typeof list[type]["evts"][i]['Langs'][lang]!="undefined"){
            continue;
        }

        if(typeof key_list[game_id]!="undefined"){
            let need_lang = {};
            for(let j = 0; j<lang_key_list.length; j++){
                let key = lang_key_list[j];

                if(key === "SC=>CPS"){
                    if(typeof key_list[game_id]["S"] != "undefined" && typeof key_list[game_id]["SC"]["CS"]!="undefined"){
                        need_lang[key] = key_list[game_id]["S"]["CS"];
                    }                   
                    continue;
                }

                if(typeof key_list[game_id][key]!="undefined"){
                    need_lang[key] = key_list[game_id][key];
                }
            }
            
            list[type]["evts"][i]['Langs'][lang] = need_lang;
        }else if(typeof key_list[game_id]=="undefined"
        && exist.indexOf(liga_id)==-1
        && typeof list[type]["evts"][i]['Langs'][lang]=="undefined"
        ){
            exist.push(liga_id);
            need_ligas.push({"LI":liga_id}); 
        }
    }
   
    await fut.beep(0.5);
    need_ligas.sort(function(a,b){
        return a.LI - b.LI;
    });
    await fut.beep(0.5);
    if(champs==""){
        //console.log(need_ligas);
        let str_list = await gen_champs_list_str(need_ligas, str_list_page_len);
        for(let i = 0; i<str_list.length; i++){
            await force_langs(type, lang, "champs="+str_list[i]+"&", lang);
        }
    }

    delete tasks_force_langs[lang];
    

    if(champs==""){
      
    }
}

/*
*   Функция для полной обработки данных
*
*   @param type {string} - Тип обрабатываемых данных
*
*   @return {void} - Ничего не возвращает
*/
var force = async function(type = "live", first = false){
    let time = force_time[type] = fut.get_unix();
    list[type]['task'] =  false;
    let str_list_page_len = (type==="live")?30:50;
    let update_time = (type==="live")?7:25;
    let champs = await load_list(type+"_champs");
    let str_list = await gen_champs_list_str(champs, str_list_page_len);
	//console.log(str_list);
    let index = 0;
    
    let tmp = [];
    tmp['evts'] = [];
    tmp['pointers'] = [];
    tmp['pointers']['langs'] = [];
    tmp['menu'] = [];
    tmp['exists'] = [];
    tmp['langs_tasks'] = [];
    tmp['langs_need_champs'] = [];
    tmp['last'] = fut.get_unix();
    tmp['task'] = false;
    tmp['time'] = time;
    tmp['alive'] = {};

    let slist_len = str_list.length; // str_list.length
   
	for(let i = 0; i<slist_len; i++){ 
		load_list(type, "champs="+str_list[i]+"&", true, "en").then(function(data){
            //console.log("Keys:", list[type]["pointers"]["KEYS"].length);
            tmp = set_pointers(data, tmp, type);

            index++;
			if(index==slis_len && tmp['tim']==force_time[type]){
                data = [];
                for(let key in list[type]["pointers"]["KEY"]){
                    let index_remove = list[type]["pointers"]["KEY"][key];
                    data.push(list[type]["evts"][index_remove]);
                }
                if(data.length>0){
                    //console.log("Recovering..", data.length);
                    tmp = set_pointers(data, tmp, type, "restore");
                }
                list[type]["pointers"]["KEY"] = [];
                tmp['exists'] = [];
                tmp['alive'] = null;
                list[type] = tmp;
                
                
                for(let ev = 0; ev<app_config.evts_langs.length; ev++){
                    force_langs(type, app_config.evts_langs[ev]);
                }

                tmp["langs_need_champs"] = [];

                champs = str_list = data = tmp = null;

                console.log("End.. ", type," - ", list[type]['evts'].length);

                setTimeout(function(){
                    let last = list[type]['last'];
                    list[type]['last'] = fut.get_unix();
                    force(type);
                }, update_time*1000);

                list[type]['task'] =  true;
            }else if(index==slist_len && tmp['time']!=force_time[type]){
                console.log("BADTIME:", tmp['time'], force_time[type]);
            }
		});
	}

}

/*
*   Функция для взятия загруженных игр
*
*   @param type {string} - Тип обрабатываемых данных
*   @param sport_id {integer} - Ид вида спорта
*   @param liga_id {integer} - Ид лиги
*   @param length {integer} - Количество игр, которые надо вернуть
*   @param mode {string} - Режим возвращения (list || dic)
*   @param lang {string} - Язык на котором надо вернуть меню
*
*   @return {array} - Список игр
*/
var get = async function(type, sport_id, liga_id, length = 5, mode = "lists", lang = "en"){
	if(typeof list[type]["pointes"]["S"+sport_id]=="undefined" || typeof list[type]["pointers"]["S"+sport_id]["C"+liga_id]=="undefined"){
		return [];
	}
	
	let need_pointers = list[type]["pointes"]["S"+sport_id]["C"+liga_id].slice(0, length);
    
    let skeys = [];
    if(sport_id==0){
        for(let key in list[type]["pointer"]){
            if (key!="S0" && key[0]=="S"){
                skeys.push(parseInt(key.substring(1)));
            }
        }

        skeys.sort(function(a, b){
            return a - b;
        });
    }else{
        skeys = [sport_id];
    }
    await fut.beep();
    
    if(liga_id==0){
        for(let i = 0; i<skeys.length; i++){
            for(let key in list[type]["pointers"]["S"+skeys[i]]){
                if (key!="C0" && key[0]=="C"){
                    ckeys.push([skeys[i],parseInt(key.substring(1))]);
                }
            }   
        }
    }else{
        for(let i = 0; i<skeys.length; i++){
            if(typeof list[type]["pointers"]["S"+skeys[i]]["C"+liga_id]!="undefined"){
                ckeys.push([skeys[i],liga_id]);
            }
        }
    }

    ckeys.sort(function(a, b){
        if(a[0]<b[0] || a[0]>b[0]){
            return a;
        }

        return a[1] - b[2];
    });

    need_pointers = [];
    for(let i = 0; i<ckeys.length; i++){
        if(need_pointers.length >= length){break;}
        need_pointers = need_pointers.concat(list[type]["pointers"]["C"+ckeys[i][1]]);
    }
    need_pointers = need_pointers.slice(0, length);
    
    let events = [];
    let beep_index = 0;
	for(let i = 0; i<need_pointers.length; i++){
        //------------ Пауза для долгих обработок ------------
        if(beep_index!=0 && beep_index%400==0){
            await fut.beep();
        }
        beep_index++;
         //------------ Пауза для долгих обработок ------------
        let item_raw = JSON.stringify(list[type]["evt"][need_pointers[i]]);
        let item = JSON.parse(item_raw);
		
        if(typeof item['Langs']!="undefined" && typeof item['Langs'][lang]!="undefined"){
            for(let key in item['Langs'][lang]){
                if(key == "SC>CPS"){
                    if(!item['SC']) {
                        item['SC'] = {};
                    }
                    item['SC']['CPS'] = item['Lang'][lang][key];
                }else {
                    item[key] = item['Lang'][lang];
                }
                
            }
        }
        
        if(mode=="dic"){
            events['I'+list[type]["evts"][need_pointers[i]]['I']] = item;
        }else if(mode=="list"){
            events.push(item);
        }
    }
    
    if(mode=="list" && type=="live"){
        events.sort(function(a, b){
			if(a.S != b.S){
				return a.S
			}
			
            return a.I;
        })
    }
	
	return events;
};

/*
*   Функция для взятие списка меню
*
*   @param type {string} - Тип обрабатываемых данных
*
*   @return {void} - Ничего не возвращает
*/
var get_menu = function(type){
    if(typeof list[type]["menu"]=="undefined"){
		return [];
    }
    
    return JSON.parse(JSON.stringify(list[type]["menu"]));
}

var list = [];

list['live'] = []; // Общий список на тип
list['live']['evts'] = []; // Список событий
list['live']['pointers'] = []; // Указатели на события для выборки
list['live']['pointers']['KEYS'] = []; // Указатели на востановление событий если их нет 
list['live']['pointers']['langs'] = []; // Указатели на языки для событий 
list['live']['menu'] = []; // Списко мен.
list['live']['langs_tasks'] = []; // Списко задач на загрузку языков
list['live']['last'] = fut.get_unix(); // Время последнего вызова
list['live']['task'] = false; // Время последнего вызова
list['live']['time'] = 0; // Время поледнего запуска работы

list['line'] = [];
list['line']['evts'] = [];
list['line']['pointers'] = [];
list['line']['pointers']['KEYS'] = [];
list['line']['pointers']['langs'] = [];
list['line']['menu'] = [];
list['line']['langs_tasks'] = [];
list['line']['last'] = fut.get_unix(); // Время последнего вызова
list['line']['task'] = false; // Время последнего вызова
list['line']['time'] = 0; // Время поледнего запуска работы

let force_time = [];
force_time['live'] = 0;
force_time['line'] = 0;

var lang_key_list = ["CN","L","LE","LR","O1","PN","V","VR", "SC>CPS"];
var need_langs = app_config.evts_langs;

var recall_stop_action = async function(type = "live", first = false){
    let recall_time = (type==="live")?25:90;
    let now = fut.get_unix();
    let diff = now - list[type]['last'];

    if(diff>recall_time && list[type]['task']===false){
        console.log("Need recall..", list[type]['task'], diff);
        list[type]['last'] = now;
        force(type);
    }else{
        
    }

    if(first===true){
        setInterval(function(){
            recall_stop_action(type);
        }, 1*1000);
    }
}

var run = async function(){
    force("live", true);
    force("line", true);

    recall_stop_action("live", true);
    recall_stop_action("line", true);
}

run();

module.exports = {
    "get":get,
    "get_menu":get_menu
};