var aws = require('aws-sdk');
// load aws config
aws.config.loadFromPath('config.json');

// load AWS SES
var ses = new aws.SES({apiVersion: '2010-12-01'});

var config = require('./config.js');

var self = module.exports = {

    /**
     * 
     * @param name
     * @param email
     * @param message
     * @param response
     */
    sendMail: function (name, email, message, response) {
        self.doMail(name, email, message, function (error, data) {
            if (error) {
                response.status(500).send(JSON.stringify(
                    {
                        message: error
                    }));
            }
            else {
                var result = JSON.stringify(
                    {
                        message: data
                    });

                console.log("Sending response to client: " + result);
                response.send(result);
            }
        });
    },
    
    /**
     * Send Email using AWS SES
     *
     * @param name
     * @param email
     * @param message
     * @param callback
     */
    doMail: function (name, email, message, callback) {

        // send to list
        var to = [config.mail_sender_address];

        var from = config.mail_sender_address;

        var params = {
            Source: from,
            Destination: {
                ToAddresses: to
            },

            Message: {
                Body: {
                    Html: {
                        Data: '<p>NAME: ' + name + '</p>'
                        + '<p>EMAIL: ' + email + '</p>'
                        + '<p>MESSAGE: ' + message + '</p>'
                    }
                },
                Subject: {Data: 'Portfolio: INQUIRY'}
            }
        };

        ses.sendEmail(params, function (err, data) {
            if (err) {
                console.log("email error " + err);
                callback(err, null);
            } // an error occurred
            else {
                console.log("email send successful " + data);
                callback(null, data);
            }
        });
    }


};

