require('dotenv').load();

var axios = require('axios');
var express = require('express');
var bodyParser = require('body-parser');
var pub = __dirname + '/public';
var app = express();
var expressLayouts = require('express-ejs-layouts');
var cpf = require('gerador-validador-cpf');
var showdown  = require('showdown');
var converter = new showdown.Converter();

let update_timer = null;
let voucher_data = null;
let invite_data = null;

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use(expressLayouts);

var Recaptcha = require('express-recaptcha');
var recaptcha = new Recaptcha(process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SITE_SECRET);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => { 
    res.redirect('http://myvt.org');
});
  
app.get("/sistema", (req, res) => {
    res.redirect("https://myvtmiim.azurewebsites.net");
});

app.get("/sat", (req, res) => {
    res.redirect("https://spark.adobe.com/page/eWYNBHKtzojOs/")
});

app.get("/update_voucher", async (req, res) => {
    try {
        voucher_data = await getVoucherData();
        res.send({ 'success': true });
    } catch (error) {
        res.send({ 'success': false, 'error': error });
    }
});

app.get("/update_invites", async (req, res) => {    
    try {
        invite_data = await getInvitesData();
        res.send({ 'success': true });
    } catch (error) {
        res.send({ 'success': false, 'error': error });
    }
});

app.get('/voucher/membros2/:invite?', async (req, res) => {
    await renderInvitePage(req, res)
});

app.get('/voucher/membros/:invite?', async (req, res) => {
    await renderInvitePage(req, res)
});

app.get('/voucher/:origin?', function(req, res) {    
    if(!voucher_data) {
        res.send("awaiting for voucher");
        setTimeout(getVoucherData, 30000);
        return;
    }

    let voucher_id = 1;
    let voucher = { formatted_text: "", header_text: ""};
    let invite: any = { indicator: "", key: "", indicated: "" };
    
    const vouchers = (voucher_data.vouchers as any[]).filter(v => v.url === req.params.origin);
    
    if(vouchers.length > 0) {
        voucher = vouchers[0];                    
        voucher_id = vouchers[0].id;
        voucher.formatted_text = converter.makeHtml(voucher.header_text);
    }

    let locals = {         
        captcha: recaptcha.render(),
        origin: req.params.origin,
        voucher_data: voucher_data,
        voucher_id: voucher_id,
        voucher, invite,
        data: JSON.stringify(voucher_data)        
    };

    res.render('voucher', locals);
});

app.get('/voucher_final/:id?', async (req, res) => {    
    if(!voucher_data) {        
        voucher_data = await getVoucherData();
    }

    let voucher_id = 1;
    let voucher = { formatted_text: "", header_text: "", final_text: "", formatted_final_text: ""};
    
    const vouchers = (voucher_data.vouchers as any[]).filter(v => v.id == req.params.id);
    
    if(vouchers.length > 0) {        
        voucher = vouchers[0];                    
        voucher_id = vouchers[0].id;
        voucher.formatted_final_text = converter.makeHtml(voucher.final_text);
    }

    let locals = {         
        captcha: recaptcha.render(),
        origin: req.params.origin,
        voucher_data: voucher_data,
        voucher_id: voucher_id,
        voucher,
        data: JSON.stringify(voucher_data)
    };

    res.render('voucher_final', locals);
});

app.post('/voucher', function(req, res) {   
    try {
        recaptcha.verify(req, function(error, data){            
            var voucher = req.body;

            let validation = validateVoucherRequest(error, voucher);                    

            if (!validation.success) {        
                res.json(validation);    
                return;    
            }
            
            postVoucher(voucher, 
            () => {
                res.json({
                    success: true        
                })
            }, (error) => {
                res.json({ 
                    success: false,
                    errors: error
                })
            });                        
        });            
    } catch (error) {
        res.json({
            success: false,
            errors: error.message
        });
    }    
});

async function renderInvitePage(req, res) {
    if(!voucher_data) {                        
        try {
            voucher_data = await getVoucherData();        
        } catch(error) {
            res.send("Error loading vouchers data, please try again or contact the support");
            return;
        }        
    }

    if(!invite_data) {        
        try {
            invite_data = await getInvitesData();        
        } catch(error) {
            res.send("Error loading invites data, please try again or contact the support");
            return;
        }        
    }

    let invite_id = 0;
    let voucher_id = 1;
    let voucher = { formatted_text: "", header_text: "", anonymous_header_text: ""};
    let invite: any = { indicator: "", key: "", indicated: "" };
    let facebook = "";
    let email = "";
    let phone = "";
    
    const vouchers = (voucher_data.vouchers as any[]).filter(v => v.url === 'membros2');
    const invites = (invite_data as any[]).filter(v => v.key === (req.params.invite as string || "").toLocaleUpperCase());
    
    //console.log(voucher_data.vouchers);
    //console.log(vouchers);
    console.log('a');
    console.log(invite_data);
    console.log(invites);

    if(vouchers.length > 0) {
        voucher = vouchers[0];                    
        voucher_id = vouchers[0].id;
    }

    if(invites.length > 0) {
        invite = invites[0];                    
        invite_id = invites[0].id;
        
        console.log(invite.contacts.find(ct => ct.contact_type == 1) != undefined);

        if(invite.contacts.find(ct => ct.contact_type == 1) != undefined) {
            email = invite.contacts.find(ct => ct.contact_type == 1).contact;
        }

        if(invite.contacts.find(ct => ct.contact_type == 4 || ct.contact_type == 5) != undefined) {
            facebook = invite.contacts.find(ct => ct.contact_type == 4 || ct.contact_type == 5).contact;            
        }

        if(invite.contacts.find(ct => ct.contact_type == 2 || ct.contact_type == 3) != undefined) {
            phone = invite.contacts.find(ct => ct.contact_type == 2 || ct.contact_type == 3).contact;                        
        }

        voucher.formatted_text = converter.makeHtml(
            replaceInvites(invite.relationship_type == 14 ? voucher.anonymous_header_text : voucher.header_text, 
                invite
            )            
        );
    }

    let locals = {         
        captcha: recaptcha.render(),
        origin: req.params.origin,
        voucher_data: voucher_data,
        voucher_id: voucher_id,
        voucher, 
        invite,
        data: JSON.stringify(voucher_data),
        data_invite: JSON.stringify(invite),
        email, phone, facebook
    };
    
    res.render('voucher2', locals);
}

function replaceInvites(text, invite_data) {
    let str = text;
    let replaces : { key: string, value: string}[] = [];

    replaces.push({ key: "indicador", value: invite_data.indicator }); 
    replaces.push({ key: "indicado", value: invite_data.indicated });

    for(let i = 0; i < replaces.length; i++) {
        let r = replaces[i];
        str = str.replace(`{{${r.key}}}`, r.value)
    }

    return str;
}

async function getInvitesData() : Promise<any> {        
    return new Promise((resolve, reject) => {
        try {
            axios.get(process.env.GET_DATA_INVITES_API)
            .then(function (response) {
                let data = response.data;                            
                resolve(data);
            });
        } catch (error) {                   
            reject(error);            
        }    
    });
}

async function getVoucherData() : Promise<any> {    
    return new Promise((resolve, reject) => {    
        try {
            axios.get(process.env.GET_DATA_VOUCHER_API)
            .then(function (response) {
                let data = response.data[0];                            
                resolve(data);
            });
        } catch (error) {
            console.log(error);
            reject(error);
            return;
        }    
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
    } catch (error) {
        onError(error);
    }         
}

function validateVoucherRequest(recaptchaError, voucher) {
    let errors = [];

    if(recaptchaError) {
        errors[errors.length] = recaptchaError;
    }

    if(!voucher) {
        return {
            success: false,
            errors: errors
        }
    }        

    if(!voucher.name || voucher.name.length < 5) {
        errors[errors.length] = "Informe seu nome completo";
    }

    if(voucher.name && voucher.name.length >= 5 && voucher.name.split(' ').length < 2) {
        errors[errors.length] = "Informe nome e sobrenome";
    }

    if(voucher.inputQuestion 
        && voucher.inputQuestion.length > 0
        && (voucher.additionalAnswer == null || voucher.additionalAnswer.length < 3)
    ) {
        errors[errors.length] = `Responda a pergunta: '${voucher.inputQuestion}'`;
    }

    if(voucher.cpf && voucher.cpf.length > 0 && !cpf.validate(voucher.cpf)) {
        errors[errors.length] = "Informe um CPF válido";
    }

    if(!voucher.phone && !voucher.socialLinks && !voucher.email 
        && voucher.email.length > 3 && !validateEmail(voucher.email)
        && voucher.phone.length <= 8
        && voucher.socialLinks && voucher.socialLinks.length < 3) {
        errors[errors.length] = "Informe ao menos um contato";
    }

    if(!voucher.unit || voucher.unit < 0) {
        errors[errors.length] = "Selecione sua unidade preferencial";
    }

    return {
        success: errors.length <= 0,
        errors: errors
    }
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

app.listen(process.env.PORT || 27577, 
    async () =>  {         
        console.log(`loading vouchers data`);
        voucher_data = await getVoucherData();

        console.log(`loading invites data`);
        invite_data = await getInvitesData();

        console.log(`Voucher app listening on port ${process.env.PORT || 27577}! `);
    }
);
