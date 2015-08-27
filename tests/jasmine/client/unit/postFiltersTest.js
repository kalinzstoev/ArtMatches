var div;

describe("User login and security test", function() {
    beforeEach(function() {
        div = document.createElement("DIV");
        var comp = UI.renderWithData(Template.postsList);
        UI.insert(comp, div);
    });

    it("should show the new-posts tab to the user", function () {
        expect($(div).find("#new-posts")[0]).toBeDefined();
    });

    it("should show the new-posts tab to the user", function () {
        expect($(div).find("#liked-posts")[0]).toBeDefined();
    });

    it("should show the new-posts tab to the user", function () {
        expect($(div).find("#discussed-posts")[0]).toBeDefined();
    });

});