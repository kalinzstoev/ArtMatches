Template.chat.events({
    'click .sendMsg': function(e) {
        sendMessage();
    },
    //Captures the event if the user presses enter instead of the button
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


//A function which grabs the string from the msg input element and inserts it in the Messages collection
sendMessage = function() {
    var message = document.getElementById("msg");
    Messages.insert({user: Meteor.user().username, msg: message.value, ts: new Date(), room: Session.get("roomName")});
    $('#msg').val("");
    el.value = "";
    el.focus();
};

Template.chat.onRendered(function(){
    Session.set("roomName", "Global");
})




