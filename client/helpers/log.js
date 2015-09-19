//A global helper method which helps for debugging by printing in the console the current data context
Template.registerHelper('log', function () {
    console.log(this);
});