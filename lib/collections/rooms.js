Rooms = new Meteor.Collection("rooms");

Rooms.deny({
    update: function (userId, doc, fieldNames, modifier) {
        return true;
    },
    remove: function (userId, doc) {
        return true;
    }
});

Rooms.allow({
    insert: function (userId, doc) {
        return (userId !== null);
    }
})

Meteor.methods({
        roomInsert: function(roomName)
        {
            check(roomName, String);
            if (Rooms.findOne({roomName: roomName}) == undefined && roomName!=""){
                Rooms.insert({roomName: roomName});
            }
        }
    }
)