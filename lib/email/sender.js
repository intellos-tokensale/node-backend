module.exports = {
    send
};

const config = require('../../config');
const logger = require('../logger');

const EmailTemplates = require('swig-email-templates');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.emailer.user,
        pass: config.emailer.password
    }
});
const templates = new EmailTemplates();



function send(template, context, to) {
    if (!template) throw new Error('Email Service: template undefined');
    if (!context) throw new Error('Email Service: context undefined');
    if (!to) throw new Error('Email Service: to undefined');
    context.frontend = config.general.frontend;
    console.log(context);
    return new Promise((resolve) => {

        template = __dirname + '/' + template;
        templates.render(template, context, (err, html, text, subject) => {
            if (!err) {
                context.subject = subject;
                logger.info('mail sent', subject);
                if (!config.emailer.sendmail) return resolve();

                transporter.sendMail({
                    from: config.emailer.from,
                    to: to,
                    subject: subject,
                    html: html,
                    text: text
                });
                resolve();
            } else {
                logger.error('there was an error sending an email', err);
            }

        });
    });
}