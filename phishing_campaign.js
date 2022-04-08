function pushEmails() {
  var app = SpreadsheetApp;

    var emailSheet = app.getActiveSpreadsheet().getSheetByName("Emails");
    var templateSheet = app.getActiveSpreadsheet().getSheetByName("template");

    var templateText = templateSheet.getRange(2, 1).getValue();

    var templateSub = templateSheet.getRange(2, 2).getValue();

    var templateCamp = templateSheet.getRange(2, 3).getValue();
  
    var templateSender = templateSheet.getRange(2, 4).getValue();

    var lastrow = emailSheet.getLastRow();

    var currUser = Session.getActiveUser().getEmail();

    var quotaLeft = MailApp.getRemainingDailyQuota();

    if (lastrow > quotaLeft) {
        Browser.msgBox("You have " + quotaLeft + " remaining but you are trying to send " + lastrow + " emails");
    } else {
        for (var i = 2; i <= lastrow; i++) {

            var currEmail = emailSheet.getRange(i, 1).getValue();
            var currName = emailSheet.getRange(i, 2).getValue();

            var messageBody = templateText.replace("{{name}}", currName);

            messageBody = messageBody.split('</body>')[0] + "<img height='0px' width='0px' src=http://insidelakeview.com/trackedby?tid=" + currEmail + "&dm=" + currUser + "&cn=" + templateCamp + ">" + "\n</body>" + messageBody.split('</body>')[1];

            var click_url = messageBody.match(/(https?|chrome):\/\/[^\s$.?#].[^\s]*{{click}}/g)[0];

            var click_tracker = "http://insidelakeview.com/path?enc=" + currEmail + "&dom=" + currUser + "&camp=" + templateCamp;

            var messageBody2 = messageBody.replace(click_url, click_tracker);

            if (messageBody2.match(/(https?|chrome):\/\/[^\s$.?#].[^\s]*{{unsub}}/g)) {

                var unsub_url = messageBody2.match(/(https?|chrome):\/\/[^\s$.?#].[^\s]*{{unsub}}/g)[0];

                var unsub_tracker = "http://insidelakeview.com/unpath?enc=" + currEmail + "&dom=" + currUser + "&camp=" + templateCamp + "&cl=" + unsub_url.replace("{{unsub}}", "");

                var messageBody3 = messageBody2.replace(unsub_url, unsub_tracker);

                GmailApp.sendEmail(currEmail, templateSub, "", {
                    name: templateSender,
                    htmlBody: messageBody3
                });

                emailSheet.getRange(i, 3).setValue("Email_Sent");
                Utilities.sleep(2000);


            } else {

              GmailApp.sendEmail(currEmail, templateSub, "", {
                    name: templateSender,
                    htmlBody: messageBody2
                });

                emailSheet.getRange(i, 3).setValue("Email_Sent");
                Utilities.sleep(2000);

            }


        }

    }
}
