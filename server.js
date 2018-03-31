require('dotenv').load();
var axios = require('axios');
var express = require('express');
var bodyParser = require('body-parser');
var pub = __dirname + '/public';
var app = express();
var expressLayouts = require('express-ejs-layouts');
var cpf = require('gerador-validador-cpf');
var update_timer = null;
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
var Recaptcha = require('express-recaptcha');
var recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SITE_SECRET);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/", function (req, res) {
    res.redirect('http://myvt.org');
});
app.get("/sistema", function (req, res) {
    res.redirect("https://myvtmiim.azurewebsites.net");
});
app.get("/sat", function (req, res) {
    res.redirect("https://spark.adobe.com/page/eWYNBHKtzojOs/");
});
app.post('/voucher', function (req, res) {
    try {
        recaptcha.verify(req, function (error, data) {
            var voucher = req.body;
            var validation = validateVoucherRequest(error, voucher);
            if (!validation.success) {
                res.json(validation);
                return;
            }
            postVoucher(voucher, function () {
                res.json({
                    success: true
                });
            }, function (error) {
                res.json({
                    success: false,
                    errors: error
                });
            });
        });
    }
    catch (error) {
        res.json({
            success: false,
            errors: error.message
        });
    }
});
function getVoucherData() {
    if (update_timer) {
        clearTimeout(update_timer);
    }
    update_timer = setTimeout(getVoucherData, process.env.VOUCHER_DATA_UPDATE_TIME);
    try {
        axios.get(process.env.GET_DATA_VOUCHER_API)
            .then(function (response) {
            var data = response.data[0];
            app.get('/voucher/:origin?', function (req, res) {
                var locals = {
                    captcha: recaptcha.render(),
                    voucher_data: data,
                    data: JSON.stringify(data)
                };
                res.render('voucher', locals);
            });
        });
    }
    catch (error) {
        console.log(error);
        return;
    }
}
function postVoucher(voucher, onSuccess, onError) {
    try {
        console.log(process.env.CREATE_VOUCHER_API);
        axios.post(process.env.CREATE_VOUCHER_API, voucher)
            .then(function (response) {
            onSuccess();
        })
            .catch(function (error) {
            onError(error);
        });
    }
    catch (error) {
        onError(error);
    }
}
function validateVoucherRequest(recaptchaError, voucher) {
    var errors = [];
    if (recaptchaError) {
        errors[errors.length] = recaptchaError;
    }
    if (!voucher) {
        return {
            success: false,
            errors: errors
        };
    }
    if (!voucher.name || voucher.name.length < 5) {
        errors[errors.length] = "Informe seu nome completo";
    }
    if (voucher.name && voucher.name.length >= 5 && voucher.name.split(' ').length < 2) {
        errors[errors.length] = "Informe nome e sobrenome";
    }
    if (voucher.email.length < 3) {
        errors[errors.length] = "Informe o e-mail";
    }
    if (voucher.email.length > 3 && !validateEmail(voucher.email)) {
        errors[errors.length] = "Informe um e-mail válido";
    }
    if (!cpf.validate(voucher.cpf)) {
        errors[errors.length] = "Informe um CPF válido";
    }
    if (!voucher.phone || voucher.phone.length <= 8) {
        errors[errors.length] = "Informe seu telefone";
    }
    if (!voucher.socialLinks || voucher.socialLinks.length < 3) {
        errors[errors.length] = "Informe seu facebook ou instagram";
    }
    if (!voucher.unit || voucher.unit < 0) {
        errors[errors.length] = "Selecione sua unidade preferencial";
    }
    return {
        success: errors.length <= 0,
        errors: errors
    };
}
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
getVoucherData();
app.listen(process.env.PORT || 27577, function () { return console.log("Voucher app listening on port " + (process.env.PORT || 27577) + "! "); });
//# sourceMappingURL=server.js.map