// Simple class for saving and retrieving a user's code via local cache
// Currently only supports the declarations they've written in the editor,
// but

class Cacher {
    constructor() {
        this.stored = {};
        if (typeof(Storage) !== "undefined" && localStorage.getItem('userDeclarations')) {
            this.stored.userDeclarations = localStorage.getItem('userDeclarations');
        }
    }

    // Gets called any time successful code has been run
    saveDeclarations(userDeclarations) {
        this.stored.userDeclarations = userDeclarations;
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem('userDeclarations', userDeclarations);
        }
    }

    // Gets called at the start in setup
    retrieveDeclarations() { return this.stored.userDeclarations; }
}
