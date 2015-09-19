// Local (client-only) collection which stores error messages
Errors = new Mongo.Collection(null);

throwError = function(message) {
    Errors.insert({message: message});
};