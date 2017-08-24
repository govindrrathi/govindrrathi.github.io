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

  $('#eventTable').on('click', '.del-btn', function(){
    var id = $(this).attr('id').replace('del', '');
    removeMsg(id);
    showEventList();
    showSentTimes();
  })

  //myStorage.removeItem("events"); // TODO: remove this when done.
  myEventList = myStorage.getItem("events");

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

    myEventList["events"].push({
      "id": 6,
      "title": 'Happy 40th #4',
      "msg": 'Something that may help you when you are awake late in the night, which does happen frequently &#x1F603;, stay tuned...',
      "dt": '',
      "completed": false
    });

    myEventList["events"].push({
      "id": 7,
      "title": 'Happy 40th #5',
      "msg": 'This may come in handy when you are getting ready for parties, just wait a little while...',
      "dt": '',
      "completed": false
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

      $('#del' + index).prop("disabled", true);
      $('#del' + index).addClass("disabled");
    } else {
      $('#dt' + index).text('Not Set');
    }
  });
}

function showEventList() {
  let evtList = JSON.parse(myStorage.getItem("events"));

  $('#eventTable').empty();

  $.each(evtList["events"], function(index, e) {

    let rowHTML = '<tr>';
    rowHTML = rowHTML + '<td>' + (index + 1) + '</td>';
    rowHTML = rowHTML + '<td><p><button id="btn' + index + '" type="button" class="btn btn-primary send-btn">Send</button></p><p><button id="del' + index + '" type="button" class="btn btn-primary del-btn">Remove</button></p></td>';
    rowHTML = rowHTML + '<td><span>' +  e.title + '</span></td>';
    rowHTML = rowHTML + '<td><span>' +  e.msg + '</span></td>';
    rowHTML = rowHTML + '<td><span id="dt' + index + '">&nbsp;</span></td>';
    rowHTML = rowHTML + '</tr>';

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
function removeMsg(msgId) {
  let evtList = JSON.parse(myStorage.getItem("events"));
  let evt = evtList["events"][msgId];

  if(!evt.completed) {
    evtList["events"] = evtList["events"].filter(function(e) {
      return e.id != evt.id
    })
  };

  myStorage.setItem("events", JSON.stringify(evtList));
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
      $("#alert-success").show();
      evt.completed = "true";
      evt.dt = Date.now();
      let dt = new Date(parseFloat(evt.dt));
      $('#dt' + msgId).text(dt.toLocaleString());
      $('#btn' + msgId).prop("disabled", true);
      $('#btn' + msgId).addClass("disabled");
      $('#del' + msgId).prop("disabled", true);
      $('#del' + msgId).addClass("disabled");
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
