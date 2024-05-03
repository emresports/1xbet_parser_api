var https = require("https");

var rand_int = function (min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}

var str_cap = function(str) {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

var check_obj_keys =  function(object, keys){
	for(let i=0; i<keys.length; i++){
		if(typeof object[keys[i]]=="undefined"){
			return false;
		}
	}
	
	return true;
}

var get_unix = function(){
	return Math.round(new Date().getTime()/1000);
}

var sleep = async function(sec = 1){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            resolve();
        },sec*1000);
    });
}

var send_request = async function(params){
	params = (typeof params=="undefined")?{}:params;
	let defalt_params = {"host": null, "path": "", "method": "GET", "headers": null, "time": 2.5};
	
	for(let key in defalt_params){
		if(typeof params[key]=="undefined"){
			params[key] = defalt_params[key];
		}
	}
	
	let {host, path, method, headers, time} = params;
	
	if(host===null){
		return null;
	}
	
    return new Promise((resolve, reject) => {
        const options = {
            hostname: host,
            port: 443,
            path: path,
            method: method,
            headers: headers
        }
        
        
        
        req.on('error', (error) => {
            resolve(null);
        })
		
		req.setTimeout(time*1000, () => {
            req.abort();
        })
        
        req.end()
    });
}

module.exports = {
	"str_cap":str_cap,
	"check_obj_keys": check_obj_keys,
	"get_unix": get_unix,	
	"sleep": sleep, 
	"send_request": send_request
};