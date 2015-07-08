Template.postSubmit.events({
    "change .file_bag": function(){
        var files = $("input.file_bag")[0].files

        Meteor.call('chooseS3Bucket', 'artmatches');

        S3.upload({
            files:files,
            path:'images'
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
    }
})

Template.postSubmit.helpers({
    "files": function(){
        return S3.collection.find();
    }
})


