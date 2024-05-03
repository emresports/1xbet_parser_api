var express = require('express'),
	  router = express.Router();
	  
var model = require("./comp.model");
	  
router.use(function(req, res, next) {
	res.set('Content-Type', 'application/json');
	next();
});

router.get('/v1/menu/:type(line|live)/:lang([a-z]{2,3})', function(req, res){
	var pkg = req.headers.package || "";
	if (pkg==""){
		res.json({
			"status":99,
			"page":"/v1/menu",
			"body":"Error in you package!"
		});
		
		return false;
	}
	
	model(req.params.type,req.params.lang,pkg,function(data, status = 1){
		res.json({
			"status":status,
			"page":"/v1/menu",
			"body":data
		});
	});
});

module.exports = router;