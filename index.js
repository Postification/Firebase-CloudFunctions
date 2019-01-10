const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

//notification参考URL
//https://github.com/firebase/functions-samples/blob/master/fcm-notifications/functions/index.js

exports.sendFollowerNotification = functions.database.ref('/Post/weight').onWrite((change, context) => {

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

  // 時間の取得のデータの書き込み
  var ref = admin.database().ref("/Post/");

  var date=new Date();
  date.setTime(date.getTime() + 1000*60*60*9);
  var year = date.getFullYear();
  var month = date.getMonth()+1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var time=year+"/"+month+"/"+day+" "+hour+":"+minute;
  console.log("time="+time);

  ref.update({
    time : time
  });

  // quantityの数を+1する
  return admin.database().ref(`/Post/quantity`).once('value').then(snapshot => {
  var quantity=snapshot.val()+1;
  console.log("quantity="+quantity);
  ref.update({
    quantity : quantity
  });

  // トークン取得
  return admin.database().ref(`/Users/token`).once('value').then(snapshot => {
    const token=snapshot.val();
    console.log("token="+token);
  
  // 通知を送る
  return admin.messaging().sendToDevice(token, payload).then(response => {
    console.log('Successfully sent notification');
  })
  .catch(error => {
    console.log('Failed to send notification');
  })
  })
  });
});