const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

//notification参考URL
//https://github.com/firebase/functions-samples/blob/master/fcm-notifications/functions/index.js

exports.sendFollowerNotification = functions.database.ref('/Post/weight').onWrite((change, context) => {

  console.log('sendFollowerNotification OK');

  var quantity;
  var time=new Array(10);
  var weight=new Array(10);

  weight[0] = change.after.val();

  // Notification details.
  const payload = {
  notification: {
     title: 'ポストに荷物が届きました',
     body: `重さ：`+weight[0]
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
  time[0]=year+"/"+month+"/"+day+" "+hour+":"+minute;

  ref.update({
    time : time[0]
  });

  // quantityの数を+1する
  return admin.database().ref(`/Post/quantity`).once('value').then(snapshot => {
    quantity=snapshot.val()+1;

    ref.update({
      quantity : quantity
    });

  //listを更新する
  return admin.database().ref(`/Post/list/`).once('value').then(snapshot => {
    var i;
    var name

    for(i=1;i<10;i++){
      name="baggage"+String(i);
      time[i]=snapshot.child(name).child("time").val();
      weight[i]=snapshot.child(name).child("weight").val();
    }

    listRef.update({
      baggage1 : {
        time : time[0],
        weight : weight[0]
      },
      baggage2 : {
        time : time[1],
        weight : weight[1]
      },
      baggage3 : {
        time : time[2],
        weight : weight[2]
      },
      baggage4 : {
        time : time[3],
        weight : weight[3]
      },
      baggage5 : {
        time : time[4],
        weight : weight[4]
      },
      baggage6 : {
        time : time[5],
        weight : weight[5]
      },
      baggage7 : {
        time : time[6],
        weight : weight[6]
      },
      baggage8 : {
        time : time[7],
        weight : weight[7]
      },
      baggage9 : {
        time : time[8],
        weight : weight[8]
      },
      baggage10 : {
        time : time[9],
        weight : weight[9]
      }
    });
  
  // トークン,送る対象を取得
  return admin.database().ref(`/user/`).once('value').then(snapshot => {
    var token=snapshot.child("user1").child("token").val();
    var send=snapshot.child("user1").child("send").val();

    if(send==1){
      //通知を送る
      return admin.messaging().sendToDevice(token, payload).then(response => {
        console.log("Successfully sent notification");
      })
      .catch(error => {
        console.log('Failed to send notification');
      })
    }
  })
  })
  });
});