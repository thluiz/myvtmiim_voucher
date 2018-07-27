let data = "";

function loadViewData(dt) {
    data = dt;
}

function changeBranch(id) {
    var select = $('#inputSchedule');
    var lblExternal = $('#lblExternal');
    var template = $.templates('#externalBranchMessageTemplate');
    var scheduleDiv = $('#schedule');

    var options = ['<option>Selecione o horário preferencial</option>'];
    select
    .find('option')
    .remove()
    .end()

    var branch = $.grep(data.branches, function(b) { return b.id == id })[0];

    if(branch.voucher_map) {
        $.each(branch.voucher_map, function(i, m) {
            var description = '';
            description += m.title ? m.title + ' - ' : '';

            description += formatArray($.map(m.week_days, (val) => val.name));

            description += " de ";
            description += m.start_hour + ":" + ('00' + m.start_minute ).slice(-2);
            description += " às ";
            description += m.end_hour + ":" +  ('00' + m.end_minute ).slice(-2);

            options[options.length] = '<option value=' + m.id + '>' + description +  '</option>'
        });

        $.each(options, function(i, v) {
            select.append($(v));
        });

        lblExternal.hide();
        scheduleDiv.show();
    } else {
        if(branch.category_id != 3) {
            select.append('<option value="-1">Em breve! Desejo ser avisado quando estiver disponível.</option>');
            lblExternal.hide();
            scheduleDiv.show();
        } else {
            lblExternal.html(template.render({
                contact_phone: branch.contact_phone,
                contact_email: branch.contact_email
            }));

            lblExternal.show();
            scheduleDiv.hide();
        }
    }
}

function formatArray(arr){
    var outStr = "";
    if (arr.length === 1) {
        outStr = arr[0];
    } else if (arr.length === 2) {
        //joins all with "and" but no commas
        //example: "bob and sam"
        outStr = arr.join(' e ');
    } else if (arr.length > 2) {
        //joins all with commas, but last one gets ", e" (oxford comma!)
        //example: "bob, joe, e sam"
        outStr = arr.slice(0, -1).join(', ') + ' e ' + arr.slice(-1);
    }
    return outStr;
}

function sendData() {
    var nameField = $('#inputName');
    var emailField = $('#inputEmail');
    var cpfField = $('#inputCPF');
    var phoneField = $('#inputPhone');
    var socialLinksField = $('#inputSocialLinks');
    var unitField = $('#inputUnit');
    var scheduleField = $('#inputSchedule');
    var voucherField = $('#inputVoucher');
    var additionalAnswerField = $('#inputAdditionalAnswer');
    var questionField = $('#inputQuestion');
    var inviteKeyField = $('#inputInviteKey');

    var data = {
        name: nameField.val(),
        email: emailField.val(),
        cpf: cpfField.val(),
        phone: phoneField.val(),
        socialLinks: socialLinksField.val(),
        unit: unitField.val(),
        schedule: $('#inputSchedule').val(),
        voucher_id: voucherField.val(),
        invite: inviteKeyField.length > 0 ? inviteKeyField.val() : null,
        "g-recaptcha-response": $('#g-recaptcha-response').val()
    };

    if(additionalAnswerField.length > 0) {
        data.inputQuestion = questionField.val();
        data.additionalAnswer = additionalAnswerField.val();
    }

    $('#ErrorContainer').hide('fade');
    $('#ErrorContainer').html('');
    $('#submitField').hide();
    $('#submitFieldMobile').hide();
    $('#sendingButton').show();
    $('#sendingButtonMobile').show();
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
                        e = "Por favor, Responda ao reCaptcha novamente"
                    }
                    $('#ErrorContainer').append(tmpl.render({message: e}));
                });

                grecaptcha.reset();

                $('#ErrorContainer').show('fade');
                $('#sendingButton').hide('fade', function() {
                    $('#submitField').show('fade');
                });

                $('#sendingButtonMobile').hide('fade', function() {
                    $('#submitFieldMobile').show('fade');
                });
                return;
            }

            $('#sendingButton').hide('fade', function() {
                location.href = "/voucher_final" + (voucherField.val() > 0 ? "/" + voucherField.val() : "");
            });
        }
    });
}

$(function() {
    $('#submitField').click(sendData);
    $('#submitFieldMobile').click(sendData);
    if($('#inputUnit').val() > 0) {
        changeBranch($('#inputUnit').val());
    }



    // Find all YouTube videos
    var $allVideos = $("iframe"),

        // The element that is fluid width
        $fluidEl = $("body");

    console.log($allVideos);

    // Figure out and save aspect ratio for each video
    $allVideos.each(function() {
      $(this).data('aspectRatio', 315 / 560)
    });

    // When the window is resized
    $(window).resize(function() {

      // Resize all videos according to their own aspect ratio
      $allVideos.each(function() {
        var $el = $(this);

        var newWidth = $($el.parent()).width();
        console.log(newWidth);

        $el
          .width(newWidth)
          .height(newWidth * $el.data('aspectRatio'));

      });

    // Kick off one resize to fix all videos on page load
    }).resize();

});
