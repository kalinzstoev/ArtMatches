//A method which takes a number and string and returns the right combination. E.g. 1 Like, 2 Likes
Template.registerHelper('pluralize', function(n, thing) {
    if (n === 1) {
        return '1 ' + thing;
    } else {
        return n + ' ' + thing + 's';
    }
});

