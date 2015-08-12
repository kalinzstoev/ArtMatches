Meteor.startup(function(){
    //Allow Origin
    BrowserPolicy.content.allowOriginForAll('*.googleapis.com');
    BrowserPolicy.content.allowOriginForAll('*.gstatic.com');
    BrowserPolicy.content.allowOriginForAll('*.soundcloud.com');
    BrowserPolicy.content.allowOriginForAll('*.youtube.com');
    BrowserPolicy.content.allowOriginForAll('*.ck-bb.co.uk');
    BrowserPolicy.content.allowOriginForAll('*.bootstrapcdn.com');



    //Allow FontDataUrl
    BrowserPolicy.content.allowFontDataUrl('fonts.googleapis.com');




});