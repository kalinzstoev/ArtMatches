// server/smtp.js
Meteor.startup(function () {
    smtp = {
        username: 'postmaster@sandbox41af3ba53d95450b98948ea897e601d0.mailgun.org',   // eg: server@gentlenode.com
        password: 'b1fb9f51ccac55eb94775730425a5b8b',   // eg: 3eeP1gtizk5eziohfervU
        server:   'smtp.mailgun.org',  // eg: mail.gandi.net
        port: 587
    }

    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});

