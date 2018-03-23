require('dotenv').load();
var express = require('express');
var bodyParser = require('body-parser');
var pub = __dirname + '/public';
var app = express();
app.use(express.static('public'));
//app.get('/', (req, res) => res.send('Hello World!'))
var Recaptcha = require('express-recaptcha');
var recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SITE_SECRET);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(process.env.PORT || 3000, () => console.log('Voucher app listening on port 3000!'));
//# sourceMappingURL=server.js.map