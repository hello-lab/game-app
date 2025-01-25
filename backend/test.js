


function getResult(e = 2 ** 52, div = 33, g = 0.5) {
    /**
     * Returns a valid multiplier based on 3 inputed parameters
     * @param {number} e - Extreme Value. Defaults to 2 ** 52.
     * @param {number} div - Initial Crash Rate. Defaults to 33.
     * @param {number} g - Growth Rate. Defaults to 1.
     * @returns {number} A multiplier value based on the crash equation
     */
    e = Math.floor(e);
    const h = Math.floor(Math.random() * e);
    g = checkg(g);
    div = checkdiv(div);
    if (h % div === 0) {
        return 1;
    }
    return 0.99 * (Math.pow(e / (e - h), 1 / g)) + 0.01;
}

// Error checking growth value (Helper Function)
function checkg(g) {
    g = Math.round(g * 10) / 10;
    if (g === 0) {
        return 1;
    }
    return g;
}

// Error checking multiplier value (Helper Function)
function checkm(m) {
    if (m < 1) {
        return 1;
    }
    return Math.round(m * 100) / 100;
}

// Error checking initial fail-rate value (Helper Function)
function checkdiv(div) {
    if (div < 1) {
        return 33;
    }
    return Math.round(div * 100) / 100;
}




console.log(getResult());
