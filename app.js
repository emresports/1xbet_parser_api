var app_config = require('app_config');
app_config.root_dir = __dirname;

var express = require('express');
var app = express();

//------------ components ------------
var main = require('./components/main');
var page_404 = require('./components/page_404');
var sports = require('./components/sports');
var countries = require('./components/countries');
var tournaments = require('./components/tournaments');
var events = require('./components/events');
var event = require('./components/event');


app.use(main);
app.use(sports);
app.use(countries);
app.use(tournaments);
app.use(events);
app.use(event);
app.use(menu);


app.use(page_404);



require(app_config.root_dir+'/taskers/cleaner_tasker.js');
require(app_config.root_dir+'/taskers/evts_tasker.js');



module.exports = app;
