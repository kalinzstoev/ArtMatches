describe("Test collection insertions", function() {


    it("It should check that comment insertion works", function () {

        // SETUP
        Comments.insert({title: 'new comment'});
        var expectedValue = Comments.find().count();

        // EXECUTE
        var actualValue = 1;

        // VERIFY
        expect(actualValue).toBe(expectedValue);

    });

    it("It should check that notification insertion works", function () {

        // SETUP
        Notifications.insert({title: 'new notification'});
        var expectedValue = Notifications.find().count();

        // EXECUTE
        var actualValue = 1;

        // VERIFY
        expect(actualValue).toBe(expectedValue);

    });

    it("It should check that the post insertion works", function () {

        // SETUP
        Posts.insert({title: 'new comment'});
        var expectedValue = Posts.find().count();

        // EXECUTE
        var actualValue = 1;

        // VERIFY
        expect(actualValue).toBe(expectedValue);

    });
});
