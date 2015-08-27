describe("User login and security test", function() {
    it("should not show submit-post link to anonymous user", function () {
        var div = document.createElement("DIV");
        var comp = UI.render(Template.header);

        UI.insert(comp, div);

        expect($(div).find("#submit-post")[0]).not.toBeDefined();
    });

    it("should be able to login normal user", function (done) {
        Meteor.loginWithPassword('testJasmine', 'testing', function (err) {
            expect(err).toBeUndefined();
            done();
        });
    });


    it("should show submit-post link to registered user", function () {
        var div = document.createElement("DIV");
        var comp = UI.render(Template.header);

        UI.insert(comp, div);

        console.log(div.innerHTML);

        expect($(div).find("#submit-post")[0]).toBeDefined();
    });


    it("should be able to logout", function (done) {
        Meteor.logout(function (err) {
            expect(err).toBeUndefined();
            done();
        });
    });
});