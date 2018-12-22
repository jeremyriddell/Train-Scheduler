// Initialize Firebase
var config = {
  apiKey: "AIzaSyACzlDE0-Df80q767Il8HRh8RIieqJVauk",
  authDomain: "train-scheduler-a712d.firebaseapp.com",
  databaseURL: "https://train-scheduler-a712d.firebaseio.com",
  projectId: "train-scheduler-a712d",
  storageBucket: "train-scheduler-a712d.appspot.com",
  messagingSenderId: "1021890926389"
};
firebase.initializeApp(config);

var database = firebase.database();

setInterval(function (startTime) {
  $("#timer").html(moment().format('hh:mm a'))
}, 1000);

$("#add-train").on("click", function () {

  event.preventDefault();

  var train = $("#trainname-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var frequency = $("#frequency-input").val().trim();
  var firstTrainTime = $("#firstTrainTime-input").val().trim();

  var trainInfo = {
    formtrain: train,
    formdestination: destination,
    formfrequency: frequency,
    formfirstTrainTime: firstTime,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  };

  database.ref().push(trainInfo);

  $("#trainname-input").val("");
  $("#destination-input").val("");
  $("#frequency-input").val("");
  $("#firstTrainTime-input").val("");

});

database.ref().on("child_added", function (childSnapshot, prevChildKey) {
  var train = childSnapshot.val().formtrain;
  var destination = childSnapshot.val().formdestination;
  var frequency = childSnapshot.val().formfrequency;
  var firstTrainTime = childSnapshot.val().formfirstTrainTime;
  var firstTrainTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
  var currentTime = moment();

  $("#timer").text(currentTime.format("hh:mm a"));

  var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
  var tRemainder = diffTime % frequency;
  var minutesAway = frequency - tRemainder;
  var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");

  $("#train-table > tbody").append("<tr><td>" + '<i class="fa fa-trash" id="trashcan" aria-hidden="true"></i>' + "</td><td>" + train + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");

}, function (errorObject) {

});

{
  $("body").on("click", ".fa-trash", function () {
    $(this).closest("tr").remove();
    alert("delete button clicked");
  });


  function timeUpdater() {

    $("#train-table > tbody").empty();

    database.ref().on("child_added", function (childSnapshot, prevChildKey) {
      var train = childSnapshot.val().formtrain;
      var destination = childSnapshot.val().formdestination;
      var frequency = childSnapshot.val().formfrequency;
      var firstTrainTime = childSnapshot.val().formfirstTraintime;
      var firstTrainTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
      var currentTime = moment();

      $("#timer").text(currentTime.format("hh:mm a"));

      var diffTime = moment().diff(moment(firstTrainTimeConverted), "minutes");
      var tRemainder = diffTime % frequency;
      var minutesAway = frequency - tRemainder;
      var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");

      $("#train-table > tbody").append("<tr><td>" + '<i class="fa fa-trash" aria-hidden="true"></i>' + "</td><td>" + train + "</td><td>" + destination + "</td><td>" +
        frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");

    })
  };

  setInterval(timeUpdater, 6000);

}