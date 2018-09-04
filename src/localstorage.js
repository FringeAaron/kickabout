this.hydrateStateWithLocalStorage();

window.addEventListener(
    "beforeunload",
    this.saveStateToLocalStorage.bind(this)
);


saveStateToLocalStorage(state) {
    // for every item in React state
    for (let key in this.state) {
        // save to localStorage
        localStorage.setItem(key, JSON.stringify(this.state[key]));
    }
}

hydrateStateWithLocalStorage() {
    // for all items in state
    for (let key in this.state) {
        // if the key exists in localStorage
        if (localStorage.hasOwnProperty(key)) {
            // get the key's value from localStorage
            let value = localStorage.getItem(key);

            // parse the localStorage string and setState
            try {
                value = JSON.parse(value);
                this.setState({ [key]: value });
            } catch (e) {
                // handle empty string
                this.setState({ [key]: value });
            }
        }
    }
}
