const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

/**
 * Triggers when a user gets a new follower and sends a notification.
 *
 * Followers add a flag to `/followers/{followedUid}/{followerUid}`.
 * Users save their device notification tokens to `/users/{followedUid}/notificationTokens/{notificationToken}`.
 */
exports.sendFollowerNotification = functions.database.ref('/Post/weight')
    .onWrite((change, context) => {

      console.log('sendFollowerNotification OK');

      const weight = change.after.val();
      console.log('wight='+weight);

      // Notification details.
      const payload = {
        notification: {
           title: 'ポストに荷物が届きました',
           body: `重さ：`+weight
         }
       };

       return admin.database().ref(`/Users/token`).once('value').then(snapshot => {
         const token=snapshot.val();
         console.log(token);

         return admin.messaging().sendToDevice(token, payload)
                .then(response => {
                  console.log('Successfully sent notification');
                })
                .catch(error => {
                  console.log('Failed to send notification');
                })
              });
            });


//notification参考URL
//https://github.com/firebase/functions-samples/blob/master/fcm-notifications/functions/index.js
