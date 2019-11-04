// import the required packages 

var http = require('http'),
    paypal = require('paypal-rest-sdk'),
    bodyParser = require('body-parser'),
    app = require('express')();

var client_id = 'Aeh8fpgAvTQlTWEgv_TfW-uFgTlt9rbcukRsNLDHSQuK72np4ce7V2MG4lScsCVHhBaO8XUDLeGWv7ar';
var secret = 'EC9RMBdgyGNpeYf4HNM1CIy4aIxO0qFLv0S4xP4PxIbAPgdctkA4H9ryB7rDK4M6xcQ7fW5XdM3-tuJL';


app.use(bodyParser.json());

//configure for sandbox environment
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': client_id,
    'client_secret': secret,
    'headers' : {
        'custom': 'header'
    }
});

//allow parsing of JSON bodies
app.get('/create', function(req, res){
    //build PayPal payment request
        var sender_batch_id = Math.random().toString(36).substring(9);
        console.log(sender_batch_id);
        var create_payout_json = {
            "sender_batch_header": {
                "sender_batch_id": sender_batch_id,
                "email_subject": "You have a payment"
            },
            "items": [
                {
                    "recipient_type": "EMAIL",
                    "amount": {
                        "value": 300.90,
                        "currency": "USD"
                    },
                    "receiver": "rain@outlook.com",
                    "note": "Thank you.",
                    "sender_item_id": "item_1"
                }
            ]
        };

        var sync_mode = 'false';

        paypal.payout.create(create_payout_json, sync_mode, function (error, payout) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                console.log("Create Single Payout Response");
                console.log(payout);
            }
        });

});

app.get('/process', function(req, res){
    var paymentId = req.query.paymentId;
    var payerId = { 'payer_id': req.query.PayerID };

    paypal.payment.execute(paymentId, payerId, function(error, payment){
        if(error){
            console.error(error);
        } else {
            if (payment.state == 'approved'){ 
                res.send('payment completed successfully');
            } else {
                res.send('payment not successful');
            }
        }
    });
});

http.createServer(app).listen(3000, function () {
   console.log('Server started: Listening on port 3000');
});