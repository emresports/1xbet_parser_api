var fs = require("fs");
var app_config =  require("app_config");
var flt = require(app_config.root_dir+'/lib/flt');
var betsModels = {};
var typeData = "_short";

String.prototype.replaceAllRTL = function() {
    var string = this;
    var aRTL_groups = [136, 2472],
        aRTL_langs  = ['fa'],
        args = arguments[0],
        groupId = arguments[1],
		lng = "";

    var isString = function(val) {
        return typeof val === 'string' || ((!!val && typeof val === 'object') && Object.prototype.toString.call(val) === '[object String]');
    };

    if (aRTL_langs.indexOf(lng) !== -1 && aRTL_groups.indexOf(groupId) !== -1) {
        // Разбор для RTL языков
        for (var i = args.length - 1; i >= 0; i--) {
            string = string.replace(isString(args[i]) ? '[]' : '()', args[i]);
        }
    } else {
        for (i = 0; i < args.length; i++) {
            string = string.replace(isString(args[i]) ? '[]' : '()', args[i]);
        }
    }

    return string;
};

var BRender = (function(){
	//var betsModels = {};
	function BRender(config){
		if (!(this instanceof BRender)){return new BRender(config)};
		this.lang = "ru";
	}

	BRender.prototype.run_render_case = function (e) {
		var t = parseFloat(e.P),
			//r = e.Pl ? e.Pl.Name : "",
			r = e.PL ? e.PL.N : "",
			a = parseInt(e.T),
			n = parseInt(e.sportId),
			s = e.BetName,
			p = parseInt(e.TT),
			//o = parseInt(e.groupId),
			o = parseInt(e.G),
			c = e.lng ? e.lng : "";
		switch (p) {
			case 1:
				return s;
			case 3:
				return ((t || 0 === t) ))  : s.replace("()", t)), s);
			case 5:
				if (t || 0 === t) {
					var i = parseInt(t)
					var	l = +parseFloat(1e3 * (t - i)).toFixed(2);
					
					s = s.replaceAllRTL([i, l], o, c)
				}
				return s;
			case 7:
				return r && (s = s.replace("[]", r)), s;
			case 9:
				return r && (t || 0 === t) && replace("()", "(" + t + ")")), s;
			case 11:
				if (r && (t || 0 === t)) {
					i = parseInt(t);
					
				}
				return s;
			case 13:
				if (t || 0 === t) {
					i = parseInt(t);
					l = parseFloat((100 * (parseFloat(t) - i)).toFixed(2));
					
					s = s.replace("()", i / 100).replace("()", l)
				}
				return s;
			case 15:
				if (t || 0 === t) {
					i = parseInt(t);
					
					s = s.replace("()", "(" + i / 1e3 + ")").replace("()", l)
				}
				return s;
			case 17:
				if (t || 0 === t) {
					i = parseInt(t);
					
					1195 != a && 1196 != a || (l = Math.abs(l));
					s = s.replace("()", i / 100).replace("()", l)
				}
				return s;
			case 21:
				if (t || 0 === t) {
					i = parseInt(t);
					l = +parseFloat(1e3 * (parseFloat(t) - i)).toFixed(5);
					var u = parseInt(l) + 1;
					
					s = s.replace("()", i / 100).replace("(1)", l + ":00").replace("(2)", u)
				}
				return s;
			case 23:
				if (t || 0 === t) {
					i = parseInt(t);
					l = +parseFloat(1e3 * (parseFloat(t) - i)).toFixed(5);
					u = parseInt(l) + 4;
				
					s = s.replace("()", i / 100).replace("(1)", l + ":00").replace("(5)", u)
				}
				return s;
			case 25:
				if (t || 0 === t) {
					i = parseInt(t);
					l = +parseFloat(1e3 * (parseFloat(t) - i)).toFixed(5);
					u = parseInt(l) + 9;
					
					s = s.replace("()", i / 100).replace("(1)", l + ":00").replace("(10)", u)
				}
				return s;
			case 27:
				if (t || 0 === t) {
					i = parseInt(t);
					l = +parseFloat(1e3 * (parseFloat(t) - i)).toFixed(5);
					u = parseInt(l) + 14;
				
					s = s.replace("()", i / 100).replace("(1)", l + ":00").replace("(15)", u)
				}
				return s;
			case 29:
				if (t || 0 === t) {
					i = parseInt(t);
					
					u = parseInt(l) + 29;
					
					s = s.replace("()", i / 100).replace("(1)", l + ":00").replace("(30)", u)
				}
				return s;
			case 31:
				if (t || 0 === t) {
					i = parseInt(t);
					l = +parseFloat(1e3 * (parseFloat(t) - i)).toFixed(5);
				
				}
				return s;
			case 33:
				return t && 0 != t ? s = s.replace("()", t) : 0 === t && (s = s.replace("()", "")), s;
			case 35:
				if (t || 0 === t) {
					i = parseInt(t);
					l = +parseFloat(1e3 * (parseFloat(t) - i)).toFixed(5);
					
				
				}
				return s;
			case 37:
				if (t || 0 === t) {
					i = parseInt(t);
					s = s.replace("()", i)
				}
				return s;
			case 39:
				if (t || 0 === t) {
					i = parseInt(t);
					
					s = s.replace("()", l).replace("()", i)
				}
				return s;
			case 41:
				return (t || 0 === t) && (s = t > 0 ? s.replace("()", t + ":0") : s.replace("()", "0:" + Math.abs(t))), s;
			case 43:
				if (t || 0 === t) {
					i = 2144 == a || 2145 == a || 2257 == a || 2258 == a ? Math.abs(parseInt(t)) : parseInt(t);
					
					s = s.replace("()", i).replace("()", l)
				}
				return s;
			case 45:
				if (t || 0 === t) {
					i = 2255 == a || 2256 == a ? Math.abs(parseInt(t)) : parseInt(t);
					
					s = s.replace("()", i).replace("()", l)
				}
				return s;
			case 49:
				if (r && (t || 0 === t)) {
					i = parseInt(t);
				
					s = s.replace("[]", r).replace("()", i / 100).replace("()", l)
				}
				return s;
			case 51:
				if (r && (t || 0 === t)) {
					i = parseInt(t);
					
					u = (1e3 * (parseFloat(t) - i)).toFixed();
					s = s.replace("[]", r).replace("()", parseInt(i / 1e3)).replace("()", l).replace("()", u)
				}
				return s;
			case 53:
				if (t || 0 === t) {
					i = parseInt(t);
					
					u = +parseFloat((1e3 * (parseFloat(t) - i)).toFixed(2)).toFixed(5);
					s = s.replace("()", parseInt(i / 100)).replace("()", l).replace("()", u)
				}
				return s;
			case 55:
				if (r && (t || 0 === t)) {
					i = parseInt(t);
					
					s = s.replace("[]", r).replace("()", i).replace("()", l)
				}
				return s;
			case 59:
				if (r && (t || 0 === t)) {
					i = parseInt(t);
				
					s = s.replace("[]", r).replace("()", i).replace("()", l)
				}
				return s;
			case 61:
				if (t || 0 === t) {
					i = parseInt(t);
					l = +parseFloat(100 * (parseFloat(i / 100) - parseInt(i / 100))).toFixed(5);
					
					s = s.replace("()", parseInt(i / 100)).replace("()", l).replace("()", u)
				}
				return s;
			case 65:
				if (t || 0 === t) {
					
					l = +(1e3 * (parseFloat(t / 1e3) - parseInt(i / 1e3))).toFixed();
					u = +(1e3 * (parseFloat(t) - i)).toFixed(2);
					s = s.replace("()", parseInt(i / 1e3)).replace("()", l).replace("()", u)
				}
				return s;
			case 69:
				if (r && (t || 0 === t)) {
					i = parseInt(t);
					l = +(100 * (parseFloat(t / 100) - parseInt(i / 100))).toFixed();
				}
				return s;
			case 71:
				if (t || 0 === t) {
					
					u = (i + +parseFloat(10 * (parseFloat(t) - i)).toFixed(5)).toFixed();
					s = s.replace("()", l).replace("()", u)
				}
				return s;
			case 75:
				if (t || 0 === t) {
					i = parseInt(t);
					l = parseInt(100 * (parseFloat(t) - i));
					s = s.replace("()", i / 100).replace("()", Math.abs(l)).replace("()", Math.abs(u))
				}
				return s;
			case 77:
				return r && (t || 0 === t) && (s = (s = t > 0 ? s.replace("()", t + ":0") : s.replace("()", "0:" + Math.abs(t))).replace("[]", r)), s;
			case 81:
				if (t || 0 === t) {
					i = parseInt(t);
					l = +(100 * (parseFloat(i / 100) - parseInt(i / 100))).toFixed(2);
					s = s.replace("()", parseInt(i / 100)).replace("()", l).replace("()", u).replace("()", f)
				}
				return s;
			case 83:
				if (t || 0 === t) {
					i = parseInt(t);
					l = +(100 * (parseFloat(i / 100) - parseInt(i / 100))).toFixed(2);
					
					s = s.replace("()", parseInt(i / 100)).replace("()", l).replace("()", u)
				}
				return s;
			case 85:
				if (t || 0 === t) {
					i = parseInt(t);
					l = +(10 * (parseFloat(i / 1e6) - parseInt(i / 1e6))).toFixed(1);
					I = +parseFloat(100 * (parseFloat((100 * (parseFloat(t) - parseInt(t))).toFixed(2)) - parseInt((100 * (parseFloat(t) - parseInt(t))).toFixed(2)))).toFixed(5);
					s = s.replace("()", l).replace("()", u).replace("()", f).replace("()", F).replace("()", I)
				}
				return s;
			case 87:
				if (t || 0 === t) {
					i = parseInt(t);
					l = +(10 * (parseFloat(i / 1e4) - parseInt(i / 1e4))).toFixed(1);
					s = s.replace("()", l).replace("()", u).replace("()", f).replace("()", F)
				}
				return s;
			case 89:
				if (t || 0 === t) {
					i = parseInt(t);
					l = +parseFloat(100 * (parseFloat(i / 100) - parseInt(i / 100))).toFixed(5);
					
					s = s.replace("()", parseInt(i / 100)).replace("()", l).replace("()", u)
				}
				return s;
			case 91:
				return this.run_render_case(Object.assign({}, e, {
					TT: 145
				}));
			case 93:
				if (t || 0 === t) {
					i = parseInt(t);
					l = parseInt(parseFloat(i / 100));
					s = s.replace("()", l + ":" + u).replace("()", f).replace("()", F)
				}
				return s;
			case 95:
				if (t || 0 === t) {
					i = parseInt(t);
					l = +parseFloat(parseFloat(i / 100)).toFixed(5);
					
					s = s.replace("()", l).replace("()", u)
				}
				return s;
			case 97:
				if (t || 0 === t) {
					i = parseInt(t);
				
					u = +parseFloat(10 * (parseFloat(t) - parseInt(t))).toFixed(5);
					s = s.replace("()", l).replace("()", u)
				}
				return s;
			case 99:
				return this.run_render_case(Object.assign({}, e, {
					TT: 555
				}));
			case 101:
				if (t || 0 === t) {
					i = parseInt(t);
					l = +(1e3 * parseFloat(parseFloat(t) - parseInt(i))).toFixed(5);
					
					s = s.replace("()", i).replace("()", l).replace("()", u)
				}
				return s;
			case 103:
				if (t || 0 === t) {
					i = parseInt(t);
					l = +(1e3 * parseFloat(parseFloat(t) - parseInt(i))).toFixed(5)
					
					s = s.replace("()", i).replace("()", l).replace("()", u);
				}
				return s;
			case 105:
				if (t || 0 === t) {
					i = parseInt(t);
					l = +(100 * (parseFloat(i / 100) - parseInt(i / 100))).toFixed(2);
					
					s = s.replace("()", parseInt(i / 100)).replace("()", l).replace("()", u)
				}
				return s;
			case 107:
				return e.BetName = this.run_render_case(Object.assign({}, e, {
					TT: 91
				})), this.run_render_case(Object.assign({}, e, {
					TT: 5
				}));
			case 111:
				if (r && (s = s.replace("[]", r)), t || 0 === t) {
					i = parseInt(t);
					l = parseInt(i / 1e6);
					
					F = +(100 * +(parseFloat(i / 100) - parseInt(i / 100)).toFixed(2)).toFixed(2);
					I = parseInt(100 * (t - i));
					
					s = s.replace("()", l).replace("()", u).replace("()", f).replace("()", F).replace("()", I).replace("()", y)
				}
				return s;
			case 113:
				return e.BetName = this.run_render_case(Object.assign({}, e, {
					TT: 91
				})), this.run_render_case(Object.assign({}, e, {
					TT: 3
				}));
			case 115:
				if (r && (s = s.replace("[]", r)), t || 0 === t) {
					i = parseInt(t);
					l = parseInt(i / 100);
					s = s.replace("()", l).replace("()", u).replace("()", f).replace("()", F)
				}
				return s;
			case 117:
				if (t || 0 === t) {
					l = ((i = parseInt(t)) / 1e3).toFixed(1);
					
					s = s.replace("()", l).replace("()", u)
				}
				return s;
			case 119:
				if (t || 0 === t) {
					l = +((i = parseInt(t)) / 1e4).toFixed(1);
					
					s = s.replace("()", l).replace("()", u).replace("()", f)
				}
				return s;
			case 121:
				if (t || 0 === t) {
					i = parseInt(t);
					
					s = s.replace("()", i).replace("()", l)
				}
				return s;
			case 123:
				if (t || 0 === t) {
					i = parseInt(t);
					l = parseInt(i / 1e6);
					
					y = parseInt(100 * +(+(100 * t).toFixed(2) - parseInt(100 * t)).toFixed(2));
					s = s.replace("()", l).replace("()", u).replace("()", f).replace("()", F).replace("()", I).replace("()", y)
				}
				return s;
			case 125:
				return e.BetName = this.run_render_case(Object.assign({}, e, {
					TT: 971
				})), this.run_render_case(Object.assign({}, e, {
					TT: 735
				}));
			case 127:
				return e.BetName = this.run_render_case(Object.assign({}, e, {
					TT: 72
				})), this.run_render_case(Object.assign({}, e, {
					TT: 621
				}));
			case 129:
				if (t) {
					(t = t.toString()).split(".")[1].length < 6 && (t = t.split(".")[0] + "." + t.split(".")[1] + new Array(6 - t.split(".")[1].length + 1).join("0"));
					i = parseInt(t.slice(-3));
					
					s = s.replace("()", f).replace("()", u).replace("()", l).replace("()", i)
				}
				return s;
			case 131:
				return e.BetName = this.run_render_case(Object.assign({}, e, {
					TT: 919
				})), this.run_render_case(Object.assign({}, e, {
					TT: 25
				}));
			case 133:
				return e.BetName = this.run_render_case(Object.assign({}, e, {
					TT: 919
				})), this.run_render_case(Object.assign({}, e, {
					TT: 31
				}));
			case 134:
				if (t) {
					i = parseInt(t);
					l = +parseFloat(i / 1e3).toFixed(10);
					
					s = s.replace("()", l).replace("()", u)
				}
				return s;
			case 135:
				return e.BetName = this.run_render_case(Object.assign({}, e, {
					TT: 99
				})), this.run_render_case(Object.assign({}, e, {
					TT: 5
				}));
			case 136:
				return e.BetName = this.run_render_case(Object.assign({}, e, {
					TT: 91
				})), this.run_render_case(Object.assign({}, e, {
					
				}));
			case 137:
				return e.BetName = this.run_render_case(Object.assign({}, e, {
					TT: 91
				})), this.run_render_case(Object.assign({}, e, {
					TT: 123
				}));
			case 138:
				if (t || 0 === t) {
					i = parseInt(t);
					
					s = s.replace("()", l).replace("()", u)
				}
				return s;
			case 139:
				if (t || 0 === t) {
					i = +t.toFixed(1);
					
					s = s.replace("()", i).replace("()", u * (l ? -1 : 1))
				}
				return s;
			case 140:
				return e.BetName = this.run_render_case(Object.assign({}, e, {
					TT: 91
				})), this.run_render_case(Object.assign({}, e, {
					TT: 13
				}));
			case 143:
				if (t || 0 === t) {
					t = t.toString();
					i = parseInt(t.slice(-2));
					l = parseInt(t.slice(-4, -2));
					
					s = s.replace("()", y).replace("()", I).replace("()", F).replace("()", f).replace("()", u).replace("()", l).replace("()", i)
				}
				return s;
			case 144:
				if (t || 0 === t) {
					i = Math.abs(parseInt(t));
					
					s = s.replace("()", i).replace("()", l)
				}
				return s;
			case 145:
				return r && (r = 1 === r.split(" - ").length ? r.split("/") : r.split(" - ")).length && r.forEach(function(e) {
					
				}), s;
			case 146:
				return e.BetName = this.run_render_case(Object.assign({}, e, {
					TT: 1845
				})), this.run_render_case(Object.assign({}, e, {
					TT: 3
				}));
			case 147:
				return e.BetName = this.run_render_case(Object.assign({}, e, {
					TT: 1458
				})), this.run_render_case(Object.assign({}, e, {
					TT: 5
				}));
			case 148:
				return e.BetName = this.run_render_case(Object.assign({}, e, {
					TT: 919
				})), this.run_render_case(Object.assign({}, e, {
					TT: 81
				}));
			case 149:
				return e.BetName = this.run_render_case(Object.assign({}, e, {
					TT: 919
				})), this.run_render_case(Object.assign({}, e, {
					TT: 85
				}));
			case 150:
				return this.run_render_case(Object.assign({}, e, {
					TT: 15
				}));
			case 151:
				return e.BetName = this.run_render_case(Object.assign({}, e, {
					TT: 9
				})), this.run_render_case(Object.assign({}, e, {
					TT: 8
				}));
			case 152:
				return e.BetName = this.run_render_case(Object.assign({}, e, {
					TT: 119
				})), this.run_render_case(Object.assign({}, e, {
					TT: 7
				}));
			case 153:
				if (t || 0 === t) {
					i = parseInt(t);
					
					s = s.replace("()", u).replace("()", l).replace("()", parseInt(i / 1e3))
				}
				return s;
			case 154:
				return e.BetName = this.run_render_case(Object.assign({}, e, {
					TT: 99
				})), this.run_render_case(Object.assign({}, e, {
					TT: 153
				}));
			default:
				return s
		}
	}
	BRender.prototype.add_lang = function(data,lang){
		betsModels[lang] = data;
	}
	
	BRender.prototype.soft_render = async function(event,lang){
		let _this =  this;
		//return new Promise(async function(resolve, reject){
			var lang = lang || _this.lang;
			
			if(typeof betsModels[lang]=="undefined"){
				var filename = app_config.root_dir+"/data/langs/oc"+typeData+"/bets_names_"+lang+".json";
				
				
				if (await flt.exists(filename) && await flt.exists(filename_groups)) {
					
					betsModels[lang+"_groups"] = require(filename_groups);
				}else{
					lang = "ru";
				}
			}
			
			if (typeof betsModels[lang][event.T] =="undefined"){
				
				return null;
			}
			let IdG = betsModels[lang][event.T].IdG;
			
			event.BetName = betsModels[lang][event.T].N;
			event.GroupName = betsModels[lang+"_groups"][IdG].N;
			event.TT = betsModels[lang][event.T].T;
			

			let finaleRender = _this.run_render_case(event);
			finaleRender = finaleRender.replace('()', '(0)');
			return [finaleRender,event.GroupName];
		//});
	}

	BRender.prototype.render = function(event,lang){
		var lang = lang || this.lang;
		if(typeof betsModels[lang]=="undefined"){
			var filename = app_config.root_dir+"/data/langs/oc"+typeData+"/bets_names_"+lang+".json";
			
			
			if (fs.existsSync(filename) && fs.existsSync(filename_groups)) {
				betsModels[lang] = require(filename);
				betsModels[lang+"_groups"] = require(filename_groups);
			}else{
				lang = "ru";
			}
			
			//lang = "ru";
		}
		
		if (typeof betsModels[lang][event.T] =="undefined"){
			return null;
		}
		let IdG = betsModels[lang][event.T].IdG;
		
		event.BetName = betsModels[lang][event.T].N;
		event.GroupName = betsModels[lang+"_groups"][IdG].N;
		event.TT = betsModels[lang][event.T].T;
		
		return [this.run_render_case(event),event.GroupName];
	}
	return BRender;
})();

var ocrender = new BRender();
betsModels["ru"] = require("../data/langs/oc"+typeData+"/bets_names_ru.json");
betsModels["ru_groups"] = require("../data/langs/oc"+typeData+"/groups_names_ru.json");

module.exports = ocrender;
