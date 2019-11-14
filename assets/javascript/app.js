let database = firebase.database();

// Add initial data into the firebase when button is clicked
$("#addTrain").on("click", function (event) {
    event.preventDefault();


    // Retrieve the user input from the fields and give them variables
    let trainName = $("#name")
        .val().trim();

    let destination = $("#destination")
        .val().trim();

    let firstTrain = $("#firstTrain")
        .val().trim();

    let frequency = $("#frequency")
        .val().trim();

    // Here is a local storage to utilize the train data
    let tempTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,

    }

    // This uploads the train data to the database
    database.ref().push(tempTrain);

    console.log("The following values were pushed to the firebase");
    console.log(tempTrain.name);
    console.log(tempTrain.destination);
    console.log(tempTrain.firstTrain);
    console.log(tempTrain.frequency);

    // This resets the input boxes
    $("#name").val("");
    $("#destination").val("");
    $("#firstTrain").val("");
    $("#frequency").val("");

});

// Here is a firebase event that formats the html and pulls data into it
database.ref().on("child_added", function (snapshot, prevChildKey) {
    console.log(snapshot.val());

    //Store all of this info into a variable
    let snapName = snapshot.val().name;
    let snapDestination = snapshot.val().destination;
    let snapFirstTrain = snapshot.val().firstTrain;
    let snapFrequency = snapshot.val().frequency;

    let timeArr = snapFirstTrain.split(":");
    let trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);

    let maxMoment = moment.max(moment(), trainTime);
    let tMinutes;
    let tArrival;

    // Here we set the arrival to the first train time if the first train is later than the current time
    if (maxMoment === trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");
    } else {
        // This is where we get the number of minutes until arrival
        let differenceTimes = moment().diff(trainTime, "minutes");
        let tRemainder = differenceTimes % snapFrequency;
        tMinutes = snapFrequency - tRemainder;

        // Here we calculate the arrival time of the train and add the tMinutes to the current time
        tArrival = moment().add(tMinutes, "m").format("hh:mm A");
    }

    console.log("tMinutes: ", tMinutes);
    console.log("tArrival: " + tArrival);

    // Here we add each piece of data to the correct column on the table

    $("#train-list").append(`
    <tr>
        <th scope="row"> ${snapName}</th>
        <td>${snapDestination}</td>
        <td>${snapFrequency}</td>
        <td>${tArrival}</td>
        <td>${tMinutes}</td>
        </tr>
        `)
});