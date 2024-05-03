var express = require('express'),
	  router = express.Router();
	  
var model = require("./comp.model");
	  
router.use(function(req, res, next) {
	res.set('Content-Type', 'application/json');
	next();
});

router.get('/v1/countries/:sport_id([0-9]{1,10})/:type(line|live)/:lang([a-z]{2,3})', function(req, res){
	var pkg = req.headers.package || "";
	if (pkg==""){
		res.json({
			"status":99,
			"page":"/v1/sports",
			"body":"Error in you package!"
		});
		
		return false;
	}
	
	model(req.params.sport_id,req.params.type,req.params.lang,pkg,function(data, status = 1){
		res.json({
			"status":status,
			"page":"/v1/countries",
			"body":data
		});
	});
});

module.exports = router;