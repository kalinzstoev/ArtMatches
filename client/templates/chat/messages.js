Template.messages.helpers({
    messages: function() {
        return Messages.find({room: Session.get("roomName")}, {sort: {ts: 1}});
    },
    roomName: function() {
        return Session.get("roomName");
    }
});

Template.message.helpers({
    timestamp: function() {
        return moment(this.ts).format('MMM Do, h:mm a');
    },
});