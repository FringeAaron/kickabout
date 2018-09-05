export function hydrateStateWithLocalStorage(that) {
    return new Promise(function (resolve, reject) {
        console.log('hydrating');
        // for all items in state
        for (let key in that.state) {
            // if the key exists in localStorage
            if (localStorage.hasOwnProperty(key)) {
                // get the key's value from localStorage
                let value = localStorage.getItem(key);

                // parse the localStorage string and setState
                try {
                    value = JSON.parse(value);
                    that.setState({[key]: value});
                } catch (e) {
                    // handle empty string
                    that.setState({[key]: value});
                }
            }
        }
        resolve(true);
    });
}


export function saveStateToLocalStorage(that) {
    // for every item in React state
    for (let key in that.state) {
        // save to localStorage
        localStorage.setItem(key, JSON.stringify(that.state[key]));
    }
}