Meteor.startup(function () {
    if (Rooms.find().count() === 0) {
        Rooms.insert({roomName: "Global"});
    }
});