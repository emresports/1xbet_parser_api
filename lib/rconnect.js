const app_config = require("app_config");
const redis = require("redis");
const client = redis.createClient(app_config.redis_port, app_config.redis_host);

client.on("error", function(error) {
    console.error("Connect to redis is failed!", error);

});

module.exports = client;
