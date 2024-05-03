var helper = require("./helper.js");
var app_config = require("app_config");
var evts = require(app_config.root_dir+'/taskers/evts_tasker.js');
var fut = require("fut");
const { check_need_key } = require("./helper.js");

var rand_int = function (min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}

var queue = async function(){
    return true;
}

var  gen_chain_id = function(post_id , table_index ) {
	var a = 10000000;
	var b = 99999999;
    var new_rand = ""+(a + rand_int(1, b-a+1));
    new_rand = new_rand.split('0').join(rand_int(1,9));
    var new_str_rand = ""+new_rand + '0' + post_id;
	
	new_str_rand = new_str_rand.substring(new_str_rand.length-9);
	new_str_rand = "0" + table_index + new_str_rand;
	new_str_rand = new_str_rand .substring(new_str_rand.length-11);
	
	return new_str_rand
}

var force_game = async function(game, type = "line"){
		return false;
	}

	if(loaded_tmp_list == false){
		return false;
	}
	let now =  Math.round(new Date().getTime()/1000);
    let table_index = (game['SI']%3+1);
    let db_table_name = "_cl_chains_"+table_index;
    let game_chain = [];
    let game_chain_abc = [];
    let mode = "insert";
    let tmp_item = null;

  
    if(typeof game['O1I']=="undefined"){
        game['O1I'] = 0;
    }

    if(typeof game['O2I']=="undefined"){
        game['O2I'] = 0;
    }

    if(typeof game['O1IS']=="undefined"){
        game['O1IS'] = [game['O1I']];
    }

    if(typeof game['O2IS']=="undefined"){
        game['O2IS'] = [game['O2I']];
    }
    // Проверяем чтобы были ИД оппонентов

    
    if(typeof game["P"]=="undefined"){
        game["P"] = "#";
    }

    if(typeof game["TI"]=="undefined"){
        game["TI"] = "#";
    }
	
    if(typeof game["IV"]=="undefined"){
        game["IV"] = "#";
    }
    // Проверяем чтобы были доп. названия событий
    // Формируем массив чейна
    game_chain = [
        game['SI'],
        game["P"],
        game["TI"],
        game["IV"]
    ];

   
    game['O1IS'] = game['O1IS'].concat(game['O2IS']);
    game['O1IS'].sort();
    
    // Формируем массив чейна с отсортированными ИД оппонентов
    game_chain_abc = [
        game['SI'],
        ...game['O1IS'],
        game["P"],
        game["TI"],
        game["IV"]
    ];

    // Формируем строчные чейны
    let game_chain_str = game_chain.join("-");
    let game_chain_abc_str = game_chain_abc.join("-");    

    // Проверяем, чтобы были имена оппонентов
	game["DI"] = (typeof game["DI"]=="undefined")?"":game["DI"];
	game["O1"] = (typeof game["O1"]=="undefined")?"Opp1":game["O1"];
	game["O2"] = (typeof game["O2"]=="undefined")?"Opp2":game["O2"];

    // Генерируем полное системное имя события 
	let game_full_name = game["O1"]+ " - "+ game["O2"]+"["+dop.join(",")+"]("+target.join(",")+")("+game["DI"]+")";

    // Выполняем проверку если игра из линии
    if(type=="line"){
		let key_list = [{"pointer_name":"const_id","target":"CI"}]; 
		
		for(let i = 0; i<key_list.length; i++){
			if(tmp_item==null){
				let target_id = game[key_list[i]['target']];
			
				let pointer_id = (typeof tmp_list[key_list[i]['pointer_name']]['ID_'+target_id]!="undefined")?tmp_list[key_list[i]['pointer_name']]['ID_'+target_id]:null;
				
				if(pointer_id!==null && typeof tmp_list['list'][pointer_id]!="undefined" && tmp_list['list'][pointer_id]['live_id']==0){
					mode = "ignore";
					
					if(tmp_list['list'][pointer_id]['live_id']!=0){/
						
						break;
					}
					
					if(tmp_item['date']!=game['S']){
						mode = "update_date";
						tmp_list['list'][pointer_id]['date'] = game['S'];
						let chain_id_storage = tmp_item['chain_id'].split('0');
						}

					if(tmp_item['line_id']!=game['I']){
						mode = "update_line_id";
						tmp_list['list'][pointer_id]['line_id'] = game['I'];
						
						let chain_id_storage = tmp_item['chain_id'].split('0');
						}
					
					
					if(tmp_item['num_id']!=game['N']){
						mode = "update_num_id";
						tmp_list['list'][pointer_id]['num_id'] = game['N'];
						
					}
				}
			}
		}
		
		
    }


    

var create_live_chain_id = async function(game){
	let query_params = [0, game["chain_str"], game["chain_str_abc"], 0, 0, 0, 0, game['I'], game['S'], 0, ""];
	
	let [tmp_row_id] = await helper.db_request('INSERT INTO _cl_chains(chain_id, chain, chain_abc, num_id, const_id, line_id,line_ids_list, live_id, date, date_list, name_list) VALUES (?,?,?,?,?,?,?,?,?,?,?)',query_params);
	let insert_id = null;

	if(tmp_row_id['affectedRows']>0){
		insert_id = tmp_row_id['insertId'];
	}else{
		return false;
	}

	let chain_id = gen_chain_id(insert_id, game["table_index"]);
	await helper.db_request('UPDATE _cl_chains SET chain_id=? WHERE id = ?',[chain_id, insert_id]);
	
	return true;
}

var create_line_chain_id = async function(game){
	
}

var set_default_game_data = function(game){
	// Проверяем чтобы были ИД оппонентов
    if(typeof game['O1I']=="undefined"){
        game['O1I'] = 0;
    }

    if(typeof game['O2I']=="undefined"){
        game['O2I'] = 0;
    }

    if(typeof game['O1IS']=="undefined"){
        game['O1IS'] = [game['O1I']];
    }

    if(typeof game['O2IS']=="undefined"){
        game['O2IS'] = [game['O2I']];
    }
    // Проверяем чтобы были ИД оппонентов

    // Проверяем чтобы были доп. названия событий
    if(typeof game["P"]=="undefined"){
        game["P"] = "#";
    }

    if(typeof game["TI"]=="undefined"){
        game["TI"] = "#";
    }
	
    if(typeof game["IV"]=="undefined"){
        game["IV"] = "#";
    }

	return game;
}

var create_chain_str = function(game){
	// Проверяем чтобы были доп. названия событий
    // Формируем массив чейна
    let game_chain = [
        game['SI'],
        //game['LI'],
        ...game['O1IS'],
        ...game['O2IS'],
        game["P"],
        game["TI"],
        game["IV"]
    ];

    // Добавляем все ИД оппонетов в один массив, чтобы отсортировать
    game['O1IS'] = game['O1IS'].concat(game['O2IS']);
    game['O1IS'].sort();
    
    // Формируем массив чейна с отсортированными ИД оппонентов
    let game_chain_abc = [
        game['SI'],
        //game['LI'],
        ...game['O1IS'],
        game["P"],
        game["TI"],
        game["IV"]
    ];

    // Формируем строчные чейны
    let game_chain_str = game_chain.join("-");
	let game_chain_abc_str = game_chain_abc.join("-");

	game["chain_str"] = game_chain_str;
	game["chain_str_abc"] = game_chain_abc_str;
	
	return game;
}

var create_chain_id =  async function(game, type = "line"){
	let now =  Math.round(new Date().getTime()/1000);
	let table_index = (game['SI']%3+1);
	game["table_index"] = table_index;
	game = set_default_game_data(game);
	game = create_chain_str(game);

	if(type=="live"){
		if (typeof tmp_list["chain"][game["chain_str"]]=="undefined" 
			&& typeof tmp_list["chain_abc"][game["chain_str_abc"]]=="undefined"){
			await create_live_chain_id(game);
		}else{
			let pointers = null;
			if (typeof tmp_list["chain"][game["chain_str"]]!="undefined"){
				pointers = tmp_list["chain"][game["chain_str"]];
			}

			if (typeof tmp_list["chain_abc"][game["chain_str_abc"]]!="undefined"){
				pointers = tmp_list["chain_abc"][game["chain_str_abc"]];
			}
			if(pointers.length>1){
				console.log(pointers, game["chain_str"], game["chain_str_abc"]);
			}
		}
	}else if (type=="line"){
		await create_line_chain_id(game);
	};
}

var force_games = async function(type){
	let list_games = await evts.get(type.toLowerCase(), 0, 0, 5000);
	
    for(let i = 0; i<list_games.length; i++){
		await force_game(list_games[i], type);
		//await create_chain_id(list_games[i], type);
		await fut.beep();
        //await queue();
	}
	console.log("End..");
}

var tmp_list = [];
var tmp_list_code = [];

	tmp_list = [];
    tmp_list['list'] = [];
    tmp_list['chain'] = [];
    tmp_list['chain_abc'] = [];
	tmp_list['num_id'] = [];
    tmp_list['const_id'] = [];
    tmp_list['line_id'] = [];
    tmp_list['live_id'] = [];
	tmp_list['chain_id'] = [];

var loaded_tmp_list =  false;
var load_tmp_list = async function(){
    if(loaded_tmp_list===true){
        return false;
    }
	//console.log('LOADED');
	loaded_tmp_list = true;

    let db_list = await helper.db_request('SELECT * FROM _cl_chains');
	
	if(db_list[0].length>0){
		db_list[0].sort(function(a, b){
			if (a.date > b.date) {
				return 1;
			}
			
			if (a.date < b.date) {
				return -1;
			}
			
			// a должно быть равным b
			return 0;
		});
	}

	tmp_list = [];
    tmp_list['list'] = [];
    tmp_list['chain'] = [];
    tmp_list['chain_abc'] = [];
	tmp_list['num_id'] = [];
    tmp_list['const_id'] = [];
    tmp_list['line_id'] = [];
    tmp_list['live_id'] = [];
	tmp_list['chain_id'] = [];
    
    for(let i = 0; i< db_list[0].length; i++){
        let index = tmp_list['list'].length;
        
        /*if(typeof tmp_list['chain'][db_list[0][i]['chain']] == "undefined" && db_list[0][i]['live_id']==0){
            //tmp_list['chain'][db_list[0][i]['chain']] = index;
            //tmp_list['chain_abc'][db_list[0][i]['chain_abc']] = index;
        }*/
		
		if(typeof tmp_list['chain'][db_list[0][i]['chain']] == "undefined"){
            tmp_list['chain'][db_list[0][i]['chain']] = [];
            tmp_list['chain_abc'][db_list[0][i]['chain_abc']] = [];
        }
		
		
	}
	
	
}

var get_chain_id = function(game_id, type){
	return null;
    if(typeof tmp_list[type+'_id']=="undefined" 
    || typeof tmp_list[type+'_id']['ID_'+game_id]=="undefined"){
        return null;
    }

    let pos = tmp_list[type+'_id']['ID_'+game_id];
    return tmp_list['list'][pos]['chain_id'];
}

var get_chain_list = function(){
	return [];
    return tmp_list['list'];
}

var get_game_id = function(chain_id, type){
	return null;
	if(chain_id[0]!="0"){
		chain_id = "0"+chain_id;
	}
	
	if(typeof tmp_list['chain_id']['ID_'+chain_id]=="undefined"){
        return null;
    }
	
	let pos = tmp_list['chain_id']['ID_'+chain_id];
	let item = tmp_list['list'][pos];
	
	if(item[type+'_id']=="undefined" || item[type+'_id']==0){
		return null;
	}
	
	return item[type+'_id'];
}

var force = async function(){
	//return false;
	try{
		loaded_tmp_list =  false;
		await load_tmp_list();
		await force_games("line");
		await force_games("live");
		
		let now =  Math.round(new Date().getTime()/1000);
		
		let remove_ids = [];
		for(let i = 0; i<tmp_list['list'].length; i++){
			if(tmp_list['list'][i]['clear_time']<now){
				remove_ids.push(tmp_list['list'][i]['chain_id']);
			}
		}
		
		
		
		console.log('End force!');

		setTimeout(function(){
			force();
		}, 10*1000);
	}catch(e){
		console.log("We find error:", e);
		setTimeout(function(){
			force();
		}, 5*1000);
	}
}

module.exports = {
    "force": force,    
	"force_game": force_game,
	"get_list": get_list
}