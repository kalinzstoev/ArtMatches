var selectedImagePostId;
var selectedImageId;
var selectedAudioPostId;
var selectedAudioContent;
var selectedWrittenPostId;
var selectedWrittenContent;

var artmatchInsert = function(currentPost,submissionId){
    var artmatch = {
        originalPostId: currentPost._id,
        title: currentPost.title,
        userId: currentPost.userId,
        author: currentPost.author,
        type: currentPost.postType,
        tags: currentPost.tags.slice(0),
        submissionsId: [],
        content: "test"
    }

    if (currentPost.postType=="visual"){
        artmatch  = _.extend(artmatch, {
                imagesIdArray: currentPost.filesIdArray.slice(0)
            }
        )
    }
    artmatch.submissionsId.push(submissionId);

    Meteor.call('artmatchInsert', artmatch, function(error, result) {
        // display the error to the user and abort
        if (error) {
            return throwError(error.reason);
        }else {
            console.log ("artmatch insert successful");
            console.log ("the id is " + result._id);
        }
    });
}


Template.submitArtMatch.events({
    'click #load-more': function (event, instance) {
        event.preventDefault();

        // get current value for limit, i.e. how many posts are currently displayed
        var limit = instance.limit.get();

        // increase limit by 8 and update it
        var increment = 6;
        limit += increment;
        instance.limit.set(limit);
    },

    'click #submit-content': function (event) {
        event.preventDefault();

        var submissionId ="";
        var currentPost = this;

        if (Session.get('postTypeTab')=="visual") {
            var submission = {
                originalPostId: selectedImagePostId,
                title: "test title",
                type: 'visual',
                content: selectedImageId,
            }

            Meteor.call('submissionInsert', submission, function (error, result) {
                // display the error to the user and abort
                if (error) {
                    return throwError(error.reason);
                } else {
                    console.log("submission insert successful");
                    submissionId = result._id;
                    artmatchInsert(currentPost,submissionId);
                }
            });
        }
    },

    'click #post-type-tabs':function(event) {
        var postType = event.target.innerHTML;
        var lastIndexSpace = postType.lastIndexOf(" ") + 1;
        postType = postType.substring(lastIndexSpace, postType.length);
        postType = postType.toLowerCase();
        Session.set('postTypeTab', postType);
    },

    'change #images-button-group':function(){
        var imageData = $('#images-button-group input:radio:checked').val();
        var divider = imageData.lastIndexOf("/")
        selectedImagePostId = imageData.substring(0,divider);
        selectedImageId = imageData.substring(divider+1,imageData.length);
    },

    'change #audio-button-group':function(){
        selectedAudioPostId = $('#audio-button-group input:radio:checked').val();
        var post = Posts.findOne({_id: selectedAudioPostId});
        console.log(post);
    },

    'change #written-button-group':function(){
        selectedWrittenPostId = $('#written-button-group input:radio:checked').val();
    }

});

Template.submitArtMatch.helpers({
    // the posts cursor
    posts: function () {
        return Template.instance().posts();
    },

    isPostTabVisual: function(){
        return Session.get('postTypeTab')=='visual';
    },

    // are there more posts to show?
    hasMoreItems: function () {
        return Template.instance().posts().count() >= Template.instance().limit.get();
    },

    isEmpty: function () {
        return Template.instance().posts().count() == 0;
    },

    images: function() {
        return Images.find({
            '_id': {$in: this.filesIdArray}
        })
    }

});

Template.submitArtMatch.onCreated(function () {

    //TODO adjust pagination for images to be based on number of images and not number of posts

    // 1. Initialization
    var instance = this;
    var userId = Meteor.userId();

    // initialize the reactive variables
    instance.loaded = new ReactiveVar(0);
    instance.limit = new ReactiveVar(6);
    Session.set('postTypeTab', 'visual');

    // 2. Autorun

    // will re-run when the "limit" reactive variables changes
    instance.autorun(function () {

        // get the limit
        var limit = instance.limit.get();

        var sort = {submitted: -1, _id: -1}

        // subscribe to the posts publication

        var  subscription = instance.subscribe('posts', {userId: userId, postType: Session.get('postTypeTab')}, {sort: sort, limit: limit});


        // if subscription is ready, set limit to newLimit

        if (subscription.ready()) {
            instance.loaded.set(limit);
        }
    });

    // 3. Cursor

    instance.posts = function() {
        return Posts.find({userId: userId, postType: Session.get('postTypeTab') }, {limit: instance.loaded.get()});
    }

});
