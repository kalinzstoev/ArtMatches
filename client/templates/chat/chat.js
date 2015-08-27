Template.chat.events({
    'click .sendMsg': function(e) {
        sendMessage();
    },
    'keyup #msg': function(e) {
        if (e.type == "keyup" && e.which == 13) {
            sendMessage();
        }
    },

    'click .create-room': function(e) {
        var roomName = document.getElementById("create-room");
        if (roomName.value!=""){
            Meteor.call("roomInsert", roomName.value);
            Session.set("roomName", roomName.value);
        }
        $('#create-room').val("");
    },
});

sendMessage = function() {
    var message = document.getElementById("msg");
    //make a insert message method
    Messages.insert({user: Meteor.user().username, msg: message.value, ts: new Date(), room: Session.get("roomName")});
    $('#msg').val("");
    el.value = "";
    el.focus();
};

Template.chat.onRendered(function(){
    Session.set("roomName", "Global");
})




