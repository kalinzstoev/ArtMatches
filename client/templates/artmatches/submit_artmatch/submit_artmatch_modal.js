Template.submitArtMatch.onCreated(function () {
    //TODO adjust pagination for images to be based on number of images and not number of posts

    // 1. Initialization


    var instance = this;
    var userId = Meteor.userId();

    instance.selectedVisualPostId = new ReactiveVar("");
    instance.selectedImageId = new ReactiveVar("");
    instance.selectedAudioPostId = new ReactiveVar("");
    instance.selectedWrittenPostId = new ReactiveVar("");

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

Template.submitArtMatch.onDestroyed(function(){

    //remove modal on rerouting
    $('#submit-artmatch').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
});


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

    'click #submit-content': function (event, instance) {
        event.preventDefault();

        var submissionId ="";
        var currentPost = this;
        var submission = {submittedToPostId: currentPost._id};
        var submittedFromPost;

        //Check first where is the submission coming from
        if (Session.get('postTypeTab')=="visual") {
            submittedFromPost = Posts.findOne(instance.selectedVisualPostId.get());
            submission = _.extend(submission, {
                submittedFromPostId: instance.selectedVisualPostId.get(),
                title: submittedFromPost.title,
                type: 'visual',
                content: instance.selectedImageId.get(),
            });

        }else if (Session.get('postTypeTab')=="audio"){
            submittedFromPost = Posts.findOne(instance.selectedAudioPostId.get());
            submission = _.extend(submission, {
                submittedFromPostId: instance.selectedAudioPostId.get(),
                title: submittedFromPost.title,
                type: 'audio',
                embed: submittedFromPost.embed,
                content: submittedFromPost.content
            });

        }else if(Session.get('postTypeTab')=="written"){
            submittedFromPost = Posts.findOne(instance.selectedWrittenPostId.get());
            submission = _.extend(submission, {
                submittedFromPostId: instance.selectedWrittenPostId.get(),
                title: submittedFromPost.title,
                type: 'written',
                content: submittedFromPost.text
            });
        }

        var existingArtmatch = Artmatches.findOne({originalPostId: currentPost._id});

        if (existingArtmatch==undefined) {
            Meteor.call('submissionInsert', submission, function (error, result) {
                // display the error to the user and abort
                if (error) {
                    return throwError(error.reason);
                } else {
                    submissionId = result;

                    Meteor.setTimeout(function () {
                        artmatchInsert(currentPost,submissionId);
                    }, 500);

                    Meteor.setTimeout(function () {
                        Meteor.call('createSubmissionNotification', submissionId, function (error) {
                            // display the error to the user and abort
                            if (error) {
                                return throwError(error.reason);
                            }
                        });
                    }, 1000);
                    toastr.success("The match was successfully submitted!");
                }
            });

        }else{

            var checkSubmission = Submissions.findOne({submittedToPostId: submission.submittedToPostId, submittedFromPostId: submission.submittedFromPostId});

            if (checkSubmission == undefined){

                Meteor.call('submissionInsert', submission, function (error, result) {
                    // display the error to the user and abort
                    if (error) {
                        return throwError(error.reason);
                    } else {
                        submissionId = result._id;
                        Artmatches.update(existingArtmatch._id, {
                            $addToSet: {submissionsId: submissionId},
                        });
                        toastr.success("The match was successfully submitted!");

                        Meteor.setTimeout(function () {
                            Router.go("artmatchPage", {_id: existingArtmatch._id});
                        }, 500);
                    }
                });
            } else {
                toastr.error("This match has already been submitted to this post.");
            }
        }
    },

    'click #post-type-tabs':function(event, instance) {
        var postType = event.target.innerHTML;
        var lastIndexSpace = postType.lastIndexOf(" ") + 1;
        postType = postType.substring(lastIndexSpace, postType.length);
        postType = postType.toLowerCase();
        Session.set('postTypeTab', postType);
    },

    'change #images-button-group':function(event, instance){
        var imageData = $('#images-button-group input:radio:checked').val();
        var divider = imageData.lastIndexOf("/")
        instance.selectedVisualPostId.set(imageData.substring(0,divider));
        instance.selectedImageId.set(imageData.substring(divider+1,imageData.length));
    },

    'change #audio-button-group':function(event, instance){
        instance.selectedAudioPostId.set($('#audio-button-group input:radio:checked').val());
        var post = Posts.findOne({_id: instance.selectedAudioPostId.get()});
    },

    'change #written-button-group':function(event, instance){
        instance.selectedWrittenPostId.set($('#written-button-group input:radio:checked').val());
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

var artmatchInsert = function(currentPost,submissionId){
    var artmatch = {
        originalPostId: currentPost._id,
        title: currentPost.title + " - ArtMatch",
        userId: currentPost.userId,
        author: currentPost.author,
        type: currentPost.postType,
        tags: currentPost.tags.slice(0),
        submissionsId: [],
    }
    if (currentPost.postType=="visual"){
        artmatch  = _.extend(artmatch, {
                filesIdArray: currentPost.filesIdArray.slice(0),
                thumbnail:""
            }
        )
    }else if(currentPost.postType=="audio"){
        artmatch  = _.extend(artmatch, {
            content: currentPost.content,
            embed: currentPost.embed,
            thumbnail: currentPost.thumbnail,
        })
    }else if(currentPost.postType=="written"){
        artmatch  = _.extend(artmatch, {
                content: currentPost.text,
                thumbnail: currentPost.thumbnail,
            }
        )
    }

    artmatch.submissionsId.push(submissionId);

    Meteor.call('artmatchInsert', artmatch, function(error, result) {
        // display the error to the user and abort
        if (error) {
            return throwError(error.reason);
        }else {
            toastr.success("Well done! You have submitted the first match ever sent to this post.");

            //Wait for 500 miliseconds for all insertion finish
            Meteor.setTimeout(function () {
                Router.go("artmatchPage", {_id: result._id});
            }, 500);
        }
    })
};
