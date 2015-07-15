Template.postSubmit.events({
    "change .add_image": function(){
        var files = $("input.add_image")[0].files

        Meteor.call('chooseS3Bucket', 'artmatches');

        S3.upload({
            files:files,
            path:'images'
        },function(e,r){
            console.log(r);
        });

    },

    "change .add_audio": function(){
        var files = $("input.add_audio")[0].files

        Meteor.call('chooseS3Bucket', 'artmatchesaudio');

        S3.upload({
            files:files,
            path:''
        },function(e,r){
            console.log(r);
        });

    },

    "click button.delete": function(){

        S3.delete(this.relative_url, function(e,r){
            console.log(r);
        });

        Meteor.call('chooseS3Bucket', 'artmatchesresized');

        S3.delete('/resized_'+this.relative_url.slice(1), function(e,r){
            console.log(r);
        });

        S3.collection.remove(this._id);
    },

    "submit form": function(e) {
        e.preventDefault();

        var post = {
            title: $(e.target).find('[name=post-title]').val(),
            description: $(e.target).find('[name=post-description]').val(),
            fileUrl: S3.collection.findOne().url,
            relativeUrl: S3.collection.findOne().relative_url,
            thumbnailUrl: 'https://s3-eu-west-1.amazonaws.com/artmatchesresized/resized_'+ S3.collection.findOne().relative_url.slice(1),
            formattedText: $('.summernote').code()
        };


        S3.collection.remove({});

        Meteor.call('postInsert', post, function(error, result) {
            // display the error to the user and abort
            if (error)
                return alert(error.reason);
            Router.go('postPage', {_id: result._id});
        });
    },

    "click button.add_text": function(){
        var dom = document.createElement("DIV");
        $(".summernote").summernote("insertNode", dom);
    },


})

Template.postSubmit.helpers({
    "files": function(){
        return S3.collection.find();
    }
})


