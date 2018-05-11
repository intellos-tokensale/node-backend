import emailConfig from "../../config/emailer.json";

var EmailTemplates = require('swig-email-templates');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailConfig.user,
        pass: emailConfig.password
    }
});
var templates = new EmailTemplates();


export default {
    send
}

function send(template, context, to) {
    template = __dirname + "/" + template;
    templates.render(template, context, function(err, html, text, subject) {
        if (!err) {
            console.log(err);
            context.subject = subject;
            // Send emailc
            console.log('mail sent', subject);
            if (!emailConfig.sendMail) return;
            transporter.sendMail({
                from: emailConfig.from,
                to: to,
                subject: subject,
                html: html,
                text: text
            });
        } else {
            console.error('there was an error sending an email', err);
        }

    });
}