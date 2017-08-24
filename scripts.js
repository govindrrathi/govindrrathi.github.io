var myStorage;
var myEventList;

$(document).ready(function () {

  $("#alert-success").hide();
  $("#alert-error").hide();

  myStorage = window.localStorage;

  $('#btnAdd').on('click', function (e) {
    addMsg();
    showEventList();
    showSentTimes();
  })

  $('#eventTable').on('click', '.send-btn', function(){
    var id = $(this).attr('id').replace('btn', '');
    sendMsg(id);
  })

  // $('#btn0').on('click', function (e) {
  //   sendMsg(0);
  // })
  //
  // $('#btn1').on('click', function (e) {
  //   sendMsg(1);
  // })
  //
  // $('#btn2').on('click', function (e) {
  //   sendMsg(2);
  // })
  //
  // $('#btn3').on('click', function (e) {
  //   sendMsg(3);
  // })
  //
  // $('#btn4').on('click', function (e) {
  //   sendMsg(4);
  // })
  //
  // $('#btn5').on('click', function (e) {
  //   sendMsg(5);
  // })

  //myStorage.removeItem("events"); // TODO: remove this when done.
  myEventList = myStorage.getItem("events");

  //alert(evt);
  if (myEventList == null) {
    // First time setup
    var eventList = '{"events": []}';

    myEventList = JSON.parse(eventList);

    myEventList["events"].push({
      "id": 0,
      "title": 'Hey!',
      "msg": 'Its 10 days to your special day, expect a load of surprises till you get to 31st &#x1F60D; &#x1F60D;',
      "dt": '1503356547103',
      "completed": true
    });

    myEventList["events"].push({
      "id": 1,
      "title": 'Happy 40th #1',
      "msg": 'Let\'s begin with a dinner tonight at one of our all time favorite place &#x1F372;',
      "dt": '1503356986663',
      "completed": true
    });

    myEventList["events"].push({
      "id": 2,
      "title": 'Hey!',
      "msg": 'It\'s going to be a &#x1F3d6;',
      "dt": '1503444877633',
      "completed": true
    });

    myEventList["events"].push({
      "id": 3,
      "title": 'Happy 40th #2',
      "msg": 'How about trying out a place of your choice today for &#x1F35B;',
      "dt": '1503445404326',
      "completed": true
    });

    myEventList["events"].push({
      "id": 4,
      "title": 'Hey!',
      "msg": 'Get ready for a memorable trip &#x2708; &#x2708;',
      "dt": '1503459624417',
      "completed": true
    });

    myEventList["events"].push({
      "id": 5,
      "title": 'Happy 40th #3',
      "msg": 'Cancun &#x1F3d6; &#x1F3d6; &#x1F378; &#x1F378;!!',
      "dt": '1503459943032',
      "completed": true
    });

    myStorage.setItem("events", JSON.stringify(myEventList));
  }

  showEventList();
  showSentTimes();
});

function showSentTimes() {
  // Set time sent on UI
  evt = myStorage.getItem("events");
  let eList = JSON.parse(evt);
  $.each(eList["events"], function(index, e) {
    if(e.completed) {
      let dt = new Date(parseFloat(e.dt));
      $('#dt' + index).text(dt.toLocaleString());
      $('#btn' + index).prop("disabled", true);
      $('#btn' + index).addClass("disabled");
    } else {
      $('#dt' + index).text('Not Set');
    }
  });
}

function showEventList() {
  let evtList = JSON.parse(myStorage.getItem("events"));
  console.log('in showEventList');
  $('#eventTable').empty();

  $.each(evtList["events"], function(index, e) {
    //console.log(JSON.stringify(e));
    let rowHTML = '<tr>';
    rowHTML = rowHTML + '<td>' + (index + 1) + '</td>';
    rowHTML = rowHTML + '<td><button id="btn' + index + '" type="button" class="btn btn-primary send-btn">Send</button></td>';
    rowHTML = rowHTML + '<td><span>' +  e.title + '</span></td>';
    rowHTML = rowHTML + '<td><span>' +  e.msg + '</span></td>';
    rowHTML = rowHTML + '<td><span id="dt' + index + '">&nbsp;</span></td></tr>';
    $('#eventTable').append(rowHTML);
  });
}

function addMsg() {
  let msgTitle = $("#msg-title").val();
  let msgText =  $("#msg-text").val();

  if(msgTitle && msgText) {
    let evtList = JSON.parse(myStorage.getItem("events"));
    let index = evtList["events"].length;

    evtList["events"].push({
      "id": index,
      "title": msgTitle,
      "msg": msgText,
      "dt": '',
      "completed": false
    });

    myStorage.setItem("events", JSON.stringify(evtList));
  }
}

function sendMsg(msgId) {

  let evtList = JSON.parse(myStorage.getItem("events"));
  let evt = evtList["events"][msgId];

  $.ajax({
    type: "POST",
    url: "https://api.pushover.net/1/messages.json",
    datatype: "application",
    data: {
      token: "amez7f12nfwjvh87a5w7cbopta8x3y",
      user: "uxXTPRem9FvhXU3jyiD1GhgYDoQQmF",
      device: "govind_iphone",
      title: evt.title,
      message: evt.msg,
      sound: "echo",
      html: 1
    },
    success: function() {
      //$('status').text("ff");
      //alert('success');
      $("#alert-success").show();
      evt.completed = "true";
      evt.dt = Date.now();
      let dt = new Date(parseFloat(evt.dt));
      $('#dt' + msgId).text(dt.toLocaleString());
      $('#btn' + msgId).prop("disabled", true);
      $('#btn' + msgId).addClass("disabled");
      myStorage.setItem("events", JSON.stringify(evtList));
    },
  })
  .done(function() {
    //alert('done');
  })
  .fail(function() {
    //alert('fail');
    $("#alert-error").show();
  })
  .always(function() {
    //alert('always');
  });
}
