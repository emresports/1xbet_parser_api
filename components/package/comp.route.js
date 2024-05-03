var app_config = require('app_config');
var express = require('express'),
	  router = express.Router();
	  
const helpers  =  require(app_config.root_dir+"/lib/helper.js");
var jwtdecode = require('jwt-decode');
	  
var model = require("./comp.model");

router.use('/v1/package/*', function(req, res, next){
	var token = req.headers.authorization || "";
	var auth = helpers.check_auth(token);
	if (auth == false){
		res.json({
			"status":99,
			"page":"/v1/package/list",
			"body":"You have bad auth"
		});
		return false;
	}
	
	next();
})

router.post('/v1/package/add', function(req, res){
	var token = req.headers.authorization || "";
	req.body.auth_data = jwtdecode(token);
	
	model.add_package(req.body, function(data, status){
		res.json({
			"status":status,
			"page":"/v1/package/add",
			"body":data
		});
	});
});

router.post('/v1/package/edit', function(req, res){
	model.edit_package(req.body, function(data, status){
		res.json({
			"status":status,
			"page":"/v1/package/edit",
			"body":data
		});
	});
});

router.post('/v1/package/remove', function(req, res){
	model.remove_package(req.body, function(data, status){
		res.json({
			"status":status,
			"page":"/v1/package/remove",
			"body":data
		});
	});
});

router.get('/v1/package/list', function(req, res){
	var token = req.headers.authorization || "";
	
	model.get_list_packages(jwtdecode(token),function(data, status){
		res.json({
			"status":status,
			"page":"/v1/package/list",
			"body":data
		});
	});
});

module.exports = router;