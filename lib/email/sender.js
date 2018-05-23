import config from "../../config";

var EmailTemplates = require('swig-email-templates');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.emailer.user,
        pass: config.emailer.password
    }
});
var templates = new EmailTemplates();


export default {
    send
}

function send(template, context, to) {
    if (!template) throw 'Email Service: template undefined';
    if (!context) throw 'Email Service: context undefined';
    if (!to) throw 'Email Service: to undefined';
    return new Promise((resolve) => {

        template = __dirname + "/" + template;
        templates.render(template, context, function(err, html, text, subject) {
            if (!err) {
                context.subject = subject;
                console.log('mail sent', subject);
                if (!config.emailer.sendMail) return resolve();

                transporter.sendMail({
                    from: config.emailer.from,
                    to: to,
                    subject: subject,
                    html: html,
                    text: text
                });
                resolve();
            } else {
                console.error('there was an error sending an email', err);
            }

        });
    });
}