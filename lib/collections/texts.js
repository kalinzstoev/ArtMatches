Texts = new Mongo.Collection('texts');



var TextsSchema = new SimpleSchema({
    content: {
        type: String,
        autoform: {
            afFieldInput: {
                type: 'summernote',
                class: 'editor',
                settings: ''
            },
            afFormGroup: {
                label: false
            }
        }
    }
});

Texts.attachSchema(TextsSchema);

Texts.allow({
    insert: function (userId, doc) {
        // only allow posting if you are logged in
        return !!userId;
    },
    update: function (userId, doc) {
        // only allow updating if you are logged in
        return !!userId;
    }
});