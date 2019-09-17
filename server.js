var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
require('dotenv').load();
var axios = require('axios');
var express = require('express');
var bodyParser = require('body-parser');
var pub = __dirname + '/public';
var app = express();
var expressLayouts = require('express-ejs-layouts');
var cpf = require('gerador-validador-cpf');
var showdown = require('showdown');
var converter = new showdown.Converter();
var update_timer = null;
var voucher_data = null;
var invite_data = null;
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
var Recaptcha = require('express-recaptcha');
var recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SITE_SECRET);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get("/", function (req, res) {
    res.redirect('https://site.myvtmi.im/voucher/aulagratis');
});
app.get("/sistema", function (req, res) {
    res.redirect("https://sig.myvtmi.im");
});
app.get("/sat", function (req, res) {
    res.redirect("https://spark.adobe.com/page/eWYNBHKtzojOs/");
});
app.get("/update_voucher", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, getVoucherData()];
            case 1:
                voucher_data = _a.sent();
                res.send({ 'success': true });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.send({ 'success': false, 'error': error_1 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/update_invites", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, getInvitesData()];
            case 1:
                invite_data = _a.sent();
                res.send({ 'success': true });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.send({ 'success': false, 'error': error_2 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get('/voucher/membros2/:invite?', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, renderInvitePage(req, res)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
app.get('/voucher/membros/:invite?', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, renderInvitePage(req, res)];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
app.get('/voucher/:origin?', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var voucher_id, voucher, invite, vouchers, email, phone, facebook, youtube_url, locals;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!voucher_data) return [3 /*break*/, 2];
                return [4 /*yield*/, getVoucherData()];
            case 1:
                voucher_data = _a.sent();
                _a.label = 2;
            case 2:
                voucher_id = 1;
                voucher = { formatted_text: "", header_text: "", youtube_url: "" };
                invite = { indicator: "", key: "", indicated: "" };
                vouchers = voucher_data.vouchers.filter(function (v) { return v.url === req.params.origin; });
                if (vouchers.length > 0) {
                    voucher = vouchers[0];
                    voucher_id = vouchers[0].id;
                    voucher.formatted_text = converter.makeHtml(voucher.header_text);
                }
                email = null;
                phone = null;
                facebook = null;
                youtube_url = null;
                if (voucher.youtube_url && voucher.youtube_url.length > 0) {
                    youtube_url = voucher.youtube_url
                        .replace("https://www.youtube.com/watch?v=", "")
                        .replace("&feature=youtu.be", "");
                }
                locals = {
                    captcha: recaptcha.render(),
                    origin: req.params.origin,
                    voucher_data: voucher_data,
                    voucher_id: voucher_id,
                    voucher: voucher, invite: invite, email: email,
                    phone: phone, facebook: facebook, youtube_url: youtube_url,
                    data: JSON.stringify(voucher_data)
                };
                res.render('voucher2', locals);
                return [2 /*return*/];
        }
    });
}); });
app.get('/voucher_final/:id?', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var voucher_id, voucher, vouchers, email, locals;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!!voucher_data) return [3 /*break*/, 2];
                return [4 /*yield*/, getVoucherData()];
            case 1:
                voucher_data = _a.sent();
                _a.label = 2;
            case 2:
                voucher_id = 1;
                voucher = { formatted_text: "", header_text: "", final_text: "", formatted_final_text: "" };
                vouchers = voucher_data.vouchers.filter(function (v) { return v.id == req.params.id; });
                if (vouchers.length > 0) {
                    voucher = vouchers[0];
                    voucher_id = vouchers[0].id;
                    voucher.formatted_final_text = converter.makeHtml(voucher.final_text);
                }
                email = "";
                locals = {
                    captcha: recaptcha.render(),
                    origin: req.params.origin,
                    voucher_data: voucher_data,
                    voucher_id: voucher_id,
                    voucher: voucher, email: email,
                    data: JSON.stringify(voucher_data)
                };
                res.render('voucher_final', locals);
                return [2 /*return*/];
        }
    });
}); });
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
function renderInvitePage(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var error_3, error_4, invite_id, voucher_id, voucher, invite, facebook, email, phone, vouchers, invites, youtube_url, locals;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!voucher_data) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, getVoucherData()];
                case 2:
                    voucher_data = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    res.send("Error loading vouchers data, please try again or contact the support");
                    return [2 /*return*/];
                case 4:
                    if (!!invite_data) return [3 /*break*/, 8];
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, getInvitesData()];
                case 6:
                    invite_data = _a.sent();
                    return [3 /*break*/, 8];
                case 7:
                    error_4 = _a.sent();
                    res.send("Error loading invites data, please try again or contact the support");
                    return [2 /*return*/];
                case 8:
                    invite_id = 0;
                    voucher_id = 1;
                    voucher = { formatted_text: "", header_text: "", anonymous_header_text: "", youtube_url: "" };
                    invite = { indicator: "", key: "", indicated: "" };
                    facebook = "";
                    email = "";
                    phone = "";
                    vouchers = voucher_data.vouchers.filter(function (v) { return v.url === 'membros' || v.url === 'membros2'; });
                    invites = invite_data.filter(function (v) { return v.key === (req.params.invite || "").toLocaleUpperCase(); });
                    if (vouchers.length > 0) {
                        voucher = vouchers[0];
                        voucher_id = vouchers[0].id;
                    }
                    if (invites.length > 0) {
                        invite = invites[0];
                        invite_id = invites[0].id;
                        console.log(invite.contacts.find(function (ct) { return ct.contact_type == 1; }) != undefined);
                        if (invite.contacts.find(function (ct) { return ct.contact_type == 1; }) != undefined) {
                            email = invite.contacts.find(function (ct) { return ct.contact_type == 1; }).contact;
                        }
                        if (invite.contacts.find(function (ct) { return ct.contact_type == 4 || ct.contact_type == 5; }) != undefined) {
                            facebook = invite.contacts.find(function (ct) { return ct.contact_type == 4 || ct.contact_type == 5; }).contact;
                        }
                        if (invite.contacts.find(function (ct) { return ct.contact_type == 2 || ct.contact_type == 3; }) != undefined) {
                            phone = invite.contacts.find(function (ct) { return ct.contact_type == 2 || ct.contact_type == 3; }).contact;
                        }
                        voucher.formatted_text = converter.makeHtml(replaceInvites(invite.relationship_type == 14 ? voucher.anonymous_header_text : voucher.header_text, invite));
                    }
                    youtube_url = null;
                    if (voucher.youtube_url && voucher.youtube_url.length > 0) {
                        youtube_url = voucher.youtube_url
                            .replace("https://www.youtube.com/watch?v=", "")
                            .replace("&feature=youtu.be", "");
                    }
                    locals = {
                        captcha: recaptcha.render(),
                        origin: req.params.origin,
                        voucher_data: voucher_data,
                        voucher_id: voucher_id,
                        voucher: voucher,
                        invite: invite,
                        data: JSON.stringify(voucher_data),
                        data_invite: JSON.stringify(invite),
                        email: email, phone: phone, facebook: facebook, youtube_url: youtube_url
                    };
                    res.render('voucher2', locals);
                    return [2 /*return*/];
            }
        });
    });
}
function replaceInvites(text, invite_data) {
    var str = text;
    var replaces = [];
    replaces.push({ key: "indicador", value: invite_data.indicator });
    replaces.push({ key: "indicado", value: invite_data.indicated });
    for (var i = 0; i < replaces.length; i++) {
        var r = replaces[i];
        str = str.replace("{{" + r.key + "}}", r.value);
    }
    return str;
}
function getInvitesData() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    try {
                        axios.get(process.env.GET_DATA_INVITES_API)
                            .then(function (response) {
                            var data = response.data;
                            resolve(data);
                        });
                    }
                    catch (error) {
                        reject(error);
                    }
                })];
        });
    });
}
function getVoucherData() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    try {
                        axios.get(process.env.GET_DATA_VOUCHER_API)
                            .then(function (response) {
                            var data = response.data[0];
                            resolve(data);
                        });
                    }
                    catch (error) {
                        console.log(error);
                        reject(error);
                        return;
                    }
                })];
        });
    });
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
    if (voucher.inputQuestion
        && voucher.inputQuestion.length > 0
        && (voucher.additionalAnswer == null || voucher.additionalAnswer.length < 3)) {
        errors[errors.length] = "Responda a pergunta: '" + voucher.inputQuestion + "'";
    }
    if (voucher.cpf && voucher.cpf.length > 0 && !cpf.validate(voucher.cpf)) {
        errors[errors.length] = "Informe um CPF válido";
    }
    if (!voucher.phone && !voucher.socialLinks && !voucher.email
        && voucher.email.length > 3 && !validateEmail(voucher.email)
        && voucher.phone.length <= 8
        && voucher.socialLinks && voucher.socialLinks.length < 3) {
        errors[errors.length] = "Informe ao menos um contato";
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
(function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getVoucherData()];
            case 1:
                voucher_data = _a.sent();
                return [4 /*yield*/, getInvitesData()];
            case 2:
                invite_data = _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
app.listen(process.env.PORT || 27577, function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("loading vouchers data");
                return [4 /*yield*/, getVoucherData()];
            case 1:
                voucher_data = _a.sent();
                console.log("loading invites data");
                return [4 /*yield*/, getInvitesData()];
            case 2:
                invite_data = _a.sent();
                console.log("Voucher app listening on port " + (process.env.PORT || 27577) + "! ");
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=server.js.map