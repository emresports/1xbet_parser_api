var express = require('express'),
	  router = express.Router();
	  
router.use(function timeLog(req, res, next) {
	res.json({
		"status":404,
		"page":req.originalUrl,
		"body":"Page not found!"
	});
});


module.exports = router;