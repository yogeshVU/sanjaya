/**
 * Created by yogesh on 7/19/17.
 */
var PORT = 9000,
    Express = require('express'),
    bodyParser = require('body-parser');

var app = new Express();

app.use(bodyParser.json());

app.post('', function (req, res) {
    var payload = req.body;

    console.log('received payload', JSON.stringify(payload, null, 2));



    res.sendStatus(200);
});

app.listen(PORT);

console.log('Server listening at port', PORT);