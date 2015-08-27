Template.rooms.events({
    'click li': function(e) {
        Session.set("roomName", e.target.innerText);
    }
});

Template.rooms.helpers({
    rooms: function() {
        return Rooms.find({}, {sort: {roomName: 1}});
    }
});

Template.room.helpers({
    roomstyle: function() {
        return Session.equals("roomName", this.roomName) ? "bold-text" : "";
    }
});