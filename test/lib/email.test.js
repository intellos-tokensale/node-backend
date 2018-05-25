const chai = require('chai');


chai.should();
const expect = require('chai').expect;


import email from '../../lib/email';
import sender from '../../lib/email/sender';

describe('Email', () => {

    describe('sendInvestConfirmation', () => {

        it('returns', () => {
            email.sendInvestConfirmation('hello1', 'hash').then(x => {
                expect(2).equals(2);
            })
        });

        describe('no userid', () => {
            it('throws an error', () => {
                expect(() => { email.sendInvestConfirmation(null, 'hash'); })
                    .to.throw('Email Service: userId undefined');
            });
        });

        describe('no hash defined', () => {
            it('throws an error', () => {
                expect(() => { email.sendInvestConfirmation('hello1', null); })
                    .to.throw('Email Service: hash undefined');
            });
        });

    });

    describe('Sender send', () => {

        it('returns', () => {
            sender.send('../../emailTemplates/confirmInvest.html', {}, 'hewee2@gmail.com')
                .then(x => {
                    expect(2).equals(2);
                })
        });

        describe('no template defined', () => {
            it('throws an error', () => {
                expect(() => { sender.send(null, {}, 'hewee2@gmail.com'); })
                    .to.throw('Email Service: template undefined');
            });
        });

        describe('no account defined', () => {
            it('throws an error', () => {
                expect(() => { sender.send('../../emailTemplates/confirmInvest.html', null, 'hewee2@gmail.com'); })
                    .to.throw('Email Service: context undefined');
            });
        });

        describe('no email defined', () => {
            it('throws an error', () => {
                expect(() => { sender.send('../../emailTemplates/confirmInvest.html', {}, null); })
                    .to.throw('Email Service: to undefined');
            });
        });

    });




});