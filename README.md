# PayPal-Payouts
Allows mass payouts from a *.csv file, on a standalone HTML page, using the email address of the payee.

Edit the Payouts.html file, and update the {Client_ID} and {Client_Secret} variables, to match that of your PayPal live or sandboxed account app.
To create a sandbox app, or live app, log into Paypal and navigate to: https://developer.paypal.com/developer/applications

Edit the {Your Company Name} variable, which will be shown in the subject line of the notification email sent to the payee.


CSV File format is as follows:


name,email,amount,notes





Mary Jane,mjane@somewhere.com,1.00,For gum.
