# PayPal-Payouts
Allows mass payouts from a *.csv file, on a standalone HTML page, using the email address of the payee.

Edit the Payouts.html file, and update the {Client_ID} and {Client_Secret} to match that of your PayPal live or sandboxed account app.
To create a sandbox app, or live app, log into Paypal and navigate to: https://developer.paypal.com/developer/applications

CSV File format is as follows.
*************Field headers*************************
name,email,amount,notes
*************Data**********************************
Mary Jane,mjane@somewhere.com,1.00,For gum.
