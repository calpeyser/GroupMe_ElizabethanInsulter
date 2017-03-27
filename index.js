var https = require('https')
var querystring = require('querystring');
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    var begin = 'Yo <TARGET NAME>,'
    res = {
        status: 200,
        body: "<p>DummyResponseData</p>"
    }   

    function post(message) {

        var data = querystring.stringify({
            token: '<TOKEN>',
            bot_id: '<BOT ID>',
            text: begin + ' ' + message
        });
        
        var options = {
            hostname: 'api.groupme.com',
            path: '/v3/bots/post',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(data)
            }
        }

        var req = https.request(options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log("body: " + chunk);
            });
        });
        req.write(data)
        req.end()
    }

    if (req.body.text.includes(begin)) {
        context.done(null, res)
    } else if (req.body.text.includes('<INSULT TRIGGER>') && req.body.name == '<USERNAME>') {
        var eliz_data = querystring.stringify({
            text: 'foobar'
        })
        var eliz_options = {
            hostname: 'quandyfactory.com',
            path: '/insult/json',
            method: 'POST'
        }
        var eliz_req = https.request(eliz_options, function(eliz_res) {
            eliz_res.on('data', (chunk) => {
                post(JSON.parse(chunk).insult)
            })
        }).on('error', function(e) {
            context.log(e)
            context.done(null, res);           
        })
        eliz_req.end()
        context.done(null, res);           
    } else {
         context.done(null, res);
    }
};