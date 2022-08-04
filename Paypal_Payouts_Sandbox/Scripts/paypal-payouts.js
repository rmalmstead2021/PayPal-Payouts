let select_batch = document.getElementById('select_batch');
let auth_url = "https://api.sandbox.paypal.com/v1/oauth2/token"
let payout_url = "https://api.sandbox.paypal.com/v1/payments/payouts"
let payouts_batch_url = 'https://api.sandbox.paypal.com/v1/payments/payouts/'
let btn_send_to_paypal = document.getElementById('btn_send_to_paypal');

//Replace with your client_ID and Client for sandbox or live app on paypal.
//https://developer.paypal.com/developer/applications
let client_id = 'CLIENT_ID';
let client_secret = 'CLIENT_SECRET';

let access_token = '';


const csvFile = document.getElementById("csvFile");

let batch_id = Math.floor(Math.random() * 300000000);
let payout_batch_id = '';
console.log("Batch_ID: " + batch_id)
//initialize the json data
let json_data = {
    "sender_batch_header": {
        "email_subject": "Paypal Payment from: {Your Company Name}",
        "sender_batch_id": "batch-" + batch_id
    },
    "items": []
}

let tbl_payments = document.getElementById("tbl_payments");

// get the batch payout info
async function paypal_get_batch_info(paypal_batch_id) {
    payout_batch_id = paypal_batch_id;
    console.log("Paypal Batch ID: " + paypal_batch_id)

    await fetch(payouts_batch_url + paypal_batch_id, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json',
            'accept-language': 'en_US',
            'authorization': 'Bearer ' + access_token,

        },

    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success Batch Info:', data);

            const table_rows = tbl_payments.rows;

            for (var index in data.items) {

                let payee_email = data.items[index].payout_item.receiver;
                let payee_name = data.items[index].payout_item.note;
                let payee_transaction_status = data.items[index].transaction_status;
                console.log("payee_email: " + payee_email)
                console.log("payee_transaction_status: " + payee_transaction_status)
                Array.from(table_rows).forEach(row => {

                    const cells = Array.from(row.cells);
                    console.log("cellrows: " + row.cells[1].innerHTML)
                    if (row.cells[1].innerHTML == payee_email) {
                        row.cells[3].innerHTML = payee_transaction_status;
                    }
                });


            }

        })
        .catch((error) => {
            console.error('Error:', error);
        });

}

//send the json file for payments
async function paypal_submit_payments() {

    await fetch(payout_url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json',
            'accept-language': 'en_US',
            'authorization': 'Bearer ' + access_token,

        },
        body: JSON.stringify(json_data)
        ,
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);

            // console.log("access_token: " + access_token)
            paypal_get_batch_info(data.batch_header.payout_batch_id);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

//get initial access auth token on page load
async function get_Access_Token() {

    var auth = 'Basic ' + btoa(client_id + ':' + client_secret).toString('base64');

    console.log("Auth Basic: " + auth)

    fetch(auth_url, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'accept': 'application/json',
            'accept-language': 'en_US',
            'authorization': auth,

        },
        body: 'grant_type=client_credentials'
        ,
    })
        .then((response) => response.json())
        .then((data) => {
            // console.log('Success:', data);
            access_token = data.access_token;
            // console.log("access_token: " + access_token)
        })
        .catch((error) => {
            console.error('Error:', error);
        });

}



//convert csv to array
function csvToArray(str, delimiter = ",") {
    console.log("raw: " + str)

    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);


    const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    const arr = rows.map(function (row) {
        const values = row.split(delimiter);
        const el = headers.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
        }, {});
        return el;
    });


    return arr;
}

//after submit file, create the json file
addEventListener("submit", function (e) {
    e.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const text = e.target.result;
        const data = csvToArray(text);



        for (var index in data) {

            //make sure name is not blank
            if (data[index].name != '' && data[index].email != '') {
                console.log("name: " + data[index].name)
                console.log("email: " + data[index].email)
                console.log("amount: " + data[index].amount)

                let name = data[index].name;
                let email = data[index].email;
                let amount = data[index].amount;

                let payee = {
                    "recipient_type": "EMAIL",
                    "amount": {
                        "value": amount,
                        "currency": "USD"
                    },
                    "receiver": email,
                    "note": name,
                    "sender_item_id": "item-654654"



                }


                var row = tbl_payments.insertRow(0);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                cell1.innerHTML = name;
                cell2.innerHTML = email;
                cell3.innerHTML = amount;
                cell4.innerHTML = '';


                json_data.items.push(payee);
            }



        }

        var row = tbl_payments.insertRow(0);

        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.innerHTML = "Name";
        cell2.innerHTML = "Email";
        cell3.innerHTML = "Amount";
        cell4.innerHTML = "Status";

        btn_send_to_paypal.disabled = false;
        console.log(json_data)
        // console.log(data);
    };

    reader.readAsText(input);
});

window.onunload = get_Access_Token();