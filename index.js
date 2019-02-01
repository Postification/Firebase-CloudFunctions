const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

//notification参考URL
//https://github.com/firebase/functions-samples/blob/master/fcm-notifications/functions/index.js

exports.sendFollowerNotification = functions.database.ref('/Post/weight').onWrite((change, context) => {

  console.log('sendFollowerNotification OK');

  var quantity;
  const weight = change.after.val();

  // Notification details.
  const payload = {
  notification: {
     title: 'ポストに荷物が届きました',
     body: `重さ：`+weight
  }
  };

  //listの書き込み用ref
  var listRef = admin.database().ref("/Post/list/");

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

  ref.update({
    time : time
  });

  // quantityの数を+1する
  return admin.database().ref(`/Post/quantity`).once('value').then(snapshot => {
    quantity=snapshot.val()+1;

    ref.update({
      quantity : quantity
    });

  //listを更新する
  return admin.database().ref(`/Post/list/baggage1/`).once('value').then(snapshot => {
    var weight1=snapshot.child("weight").val();
    var time1=snapshot.child("time").val();

    listRef.update({
      baggage1 : {
        time : time,
        weight : weight
      }
    });
  
  return admin.database().ref(`/Post/list/baggage2/`).once('value').then(snapshot => {
    var weight2=snapshot.child("weight").val();
    var time2=snapshot.child("time").val();

    listRef.update({
      baggage2 : {
        time : time1,
        weight : weight1
      }
    });
  
  return admin.database().ref(`/Post/list/baggage3/`).once('value').then(snapshot => {
    var weight3=snapshot.child("weight").val();
    var time3=snapshot.child("time").val();

    listRef.update({
      baggage3 : {
        time : time2,
        weight : weight2
      }
    });

  return admin.database().ref(`/Post/list/baggage4/`).once('value').then(snapshot => {
    var weight4=snapshot.child("weight").val();
    var time4=snapshot.child("time").val();
  
    listRef.update({
      baggage4 : {
        time : time3,
        weight : weight3
      }
    });

    listRef.update({
      baggage5 : {
        time : time4,
        weight : weight4
      }
    });

  
  // トークン1取得
  return admin.database().ref(`/Users/token1`).once('value').then(snapshot => {
    const token1=snapshot.val();
    console.log(token1);
  
  // 通知を送る
  return admin.messaging().sendToDevice(token1, payload).then(response => {
    console.log('Successfully sent notification1');
  
  // トークン2取得
  return admin.database().ref(`/Users/token2`).once('value').then(snapshot => {
    const token2=snapshot.val();
    console.log(token2);
  
  // 通知を送る
  return admin.messaging().sendToDevice(token2, payload).then(response => {
    console.log('Successfully sent notification2');
  })
  .catch(error => {
    console.log('Failed to send notification2');
  })
  })
  })
  .catch(error => {
    console.log('Failed to send notification1');
  })
  })
  })
  })
  })
  })
  });
});