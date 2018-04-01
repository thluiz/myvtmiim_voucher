let data = "";

function loadViewData(dt) {
    data = dt;    
}

function changeBranch(id) {
    var select = $('#inputSchedule');
    var options = ['<option>Selecione o horário preferencial</option>'];                
    select
    .find('option')
    .remove()
    .end()

    var branch = $.grep(data.branches, function(b) { return b.id == id })[0];
    
    $.each(branch.voucher_map, function(i, m) {
        var description = '';
        description += m.title ? m.title + ' - ' : '';
                
        $.each(m.week_days, function(z, w) { 
            if(z == m.week_days.length -1) {
                description += " e ";
            }

            description += w.name;

            if(m.week_days.length > 2 && z != 1 && (z != m.week_days.length -1) ) {
                description += ", "
            }            
        });
        
        description += " de ";
        description += m.start_hour + ":" + ('00' + m.start_minute ).slice(-2);
        description += " às ";
        description += m.end_hour + ":" +  ('00' + m.end_minute ).slice(-2);

        options[options.length] = '<option value=' + m.id + '>' + description +  '</option>'
    });

    $.each(options, function(i, v) {
       select.append($(v));
    });        
}

function sendData() {            
    var nameField = $('#inputName');
    var emailField = $('#inputEmail');
    var cpfField = $('#inputCPF');
    var phoneField = $('#inputPhone');
    var socialLinksField = $('#inputSocialLinks');
    var unitField = $('#inputUnit');
    var scheduleField = $('#inputSchedule');

    var data = {
        name: nameField.val(),
        email: emailField.val(),
        cpf: cpfField.val(),
        phone: phoneField.val(),
        socialLinks: socialLinksField.val(),
        unit: unitField.val(),
        schedule: $('#inputSchedule').val(),
        "g-recaptcha-response": $('#g-recaptcha-response').val() 
    };

    $('#ErrorContainer').hide('fade');
    $('#ErrorContainer').html('');
        
    $.ajax({
        type: "post",
        url: "/voucher",
        dataType: 'json',
        data: data,
        success: function( data ) {
            var tmpl = $.templates("#errorTemplate");
            var errors = [];

            if(!data) {
                errors[errors.length] = "Ocorreu um erro ao enviar seus dados, por favor, tente novamente";                    
            }

            if(data && !data.success) {
                errors = data.errors;
            }

            if(errors.length > 0) {                    
                $.each(errors, function(i, e) {
                    if(e === "invalid-input-response") {
                        e = "Por favor, responda ao captcha";
                    } else if(e === "timeout-or-duplicate") {
                        grecaptcha.reset();
                        e = "Por favor, Responda ao reCaptcha novamente"
                    }
                    $('#ErrorContainer').append(tmpl.render({message: e}));
                });

                $('#ErrorContainer').show('fade');
                return;
            }
            
            $('#submitField').hide('fade', function() {
                $('#successMessage').show('fade');
            });                
        }
    });    
}

$(function() {    
    $('#submitField').click(sendData);
});

