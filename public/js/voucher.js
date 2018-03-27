$(function() {        
    $('#submitField').click(function() {        
        var nameField = $('#inputName');
        var emailField = $('#inputEmail');
        var cpfField = $('#inputCPF');
        var phoneField = $('#inputPhone');
        var socialLinksField = $('#inputSocialLinks');
        var unitField = $('#inputUnit');

        var data = {
            name: nameField.val(),
            email: emailField.val(),
            cpf: cpfField.val(),
            phone: phoneField.val(),
            socialLinks: socialLinksField.val(),
            unit: unitField.val(),
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
    });



}); 