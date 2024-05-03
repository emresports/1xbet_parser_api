var express = require('express'),
	  router = express.Router();
	  
var model = require("./comp.model");
	  
router.use(function(req, res, next) {
	res.set('Content-Type', 'application/json');
	next();
});

router.get('/v1/events/:sport_id([0-9]{1,10})/:tournament_id([0-9]{1,10})/:ltype(list|sub)/:length([0-9]{1,9})/:type(line|live)/:lang([a-z]{2,3})', function(req, res){
	var pkg = req.headers.package || "";
	if (pkg==""){
		res.json({
			"status":99,
			"page":"/v1/sports",
			"body":"Error in you package!"
		});
		
		return false;
	}
	
	model(req.params.sport_id,req.params.tournament_id,req.params.type,req.params.lang,req.params.ltype,req.params.length,pkg,function(data, status = 1){
		res.json({
			"status":status,
			"page":"/v1/events",
			"body":data
		});
	});
});

router.get('/v1/events/:sport_id([0-9]{1,10})/:tournament_id([0-9]{1,10})/:ltype(list|sub)/:length([0-9]{1,9})/:type(line|live)/:lang([a-z]{2,3})/:top(true|false)', function(req, res){
	var pkg = req.headers.package || "";
	if (pkg==""){
		res.json({
			"status":99,
			"page":"/v1/sports",
			"body":"Error in you package!"
		});
		
		return false;
	}
	
	model(req.params.sport_id,req.params.tournament_id,req.params.type,req.params.lang,req.params.ltype,req.params.length,pkg,function(data, status = 1){
		res.json({
			"status":status,
			"page":"/v1/events",
			"body":data
		});
	}, req.params.top);
});

router.get('/v1/longload/:sec([0-9]{1,10})', function(req, res){
	setTimeout(function(){
		res.json({
			"status":1,
			"page":"/v1/longload",
			"body":true
		});
	},req.params.sec*1000);
});

module.exports = router;