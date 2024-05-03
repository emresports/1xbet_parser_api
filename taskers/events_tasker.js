var https =  require("https");

let run_request = async function(url){
    return new Promise((resolve, reject) => {
        let req = https.get(url, res => {
            res.setEncoding("utf8");
            res.setTimeout(3*1000);

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

        req.setTimeout(8500, () => {  
            console.log('Abort!', url);
            req.abort();
        })
    });
}

var get_games = async function(url){
    
    let list_games_raw = await run_request(url);
    let list_games = [];
    try{
        list_games = JSON.parse(list_games_raw);
    }catch(e){
        return [];
    }

    return list_games['Value'];
}

var force_games = async function(champs = ""){
    let url = host+champs+params;
	let list_games = await get_games(url);
    
	for(let i = 0; i<list_games.length; i++){
		if(typeof champs_line_list['ID_'+list_games[i]['LI']]!="undefined"){
			delete champs_line_list['ID_'+list_games[i]['LI']];
		}
    }
	
	return list_games;
}

var champs_line_list = {};
var gen_champs_line_list = async function(){
	let tf = 2200000;
	let now =  Math.round(new Date().getTime()/1000);
	let url = host;
	let games = await get_games(url);
	
	for(let i = 0; i<games.length; i++){
		champs_line_list['ID_'+games[i]['LI']] = [games[i]['LI'], games[i]['L'], games[i]['SN']];
	}
	
	return champs_line_list;
}

var gen_champs_line_list_str = function(){
	let list = [];
	for(let key in champs_line_list){
		list.push(champs_line_list[key][0]);
	}
	
	list.sort(function(a, b) {
	  return a - b;
	});
	
	let finale_list = [];
	
	for(let i = 0; i<list.length; i+=100){
		finale_list.push(list.slice(i, i+100).join(","));
	}
	
	return finale_list;
}

var pointers = [];
var force_all_events = async function(events){
	pointers = [];
	pointers["S0"] = [];
	pointers["S0"]["C0"] = [];
	
	for(let i = 0; i<events.length; i++){
		pointers["S0"]["C0"].push(i);
		if(typeof pointers["S0"]["C"+events[i]['LI']]=="undefined"){
			pointers["S0"]["C"+events[i]['LI']] = [];
		}
		pointers["S0"]["C"+events[i]['LI']].push(i);
		
		
		
		pointers["S"+events[i]['SI']]["C0"].push(i);
		pointers["S"+events[i]['SI']]["C"+events[i]['LI']].push(i);
	}
	
};

var get_events = function(sport_id, liga_id){
	if(typeof pointers["S"+sport_id]=="undefined" || typeof pointers["S"+sport_id]["C"+liga_id]=="undefined"){
		return [];
	}
	
	let need_pointers = pointers["S"+sport_id]["C"+liga_id];
	
	events = [];
	for(let i = 0; i<need_pointers.length; i++){
		events['I'+main_games[need_pointers[i]]['I']] = main_games[need_pointers[i]];
	}
	
	return events;
};

var main_games = [];
var run = async function(){
	
	await gen_champs_line_list();
	main_games = await force_games("");
	
	let str_list = gen_champs_line_list_str();
	let all_length = 0;
	let index = 0;
	for(let i = 0; i<str_list.length; i++){
		force_games("champs="+str_list[i]+"&").then(function(data){
			main_games = main_games.concat(data);
			
			
			if(index==str_list.length){
				force_all_events(main_games);
				console.log("End loaded ext games!");
			}
		});
	}
	
	setTimeout(run, 25*1000);
}

run();

module.exports = {
	"get":get_events
};