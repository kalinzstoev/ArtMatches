Template.artmatchesList.helpers({

    artmatches: function(){
        return Artmatches.find();
    },

    hasArtmatches: function(){
        return Artmatches.find().count()>0;
    }
});