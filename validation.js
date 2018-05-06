const connection = require("./connection");

function integerGreaterThanZero(val) {
    if (/^[1-9]\d*$/.test(val)) {
        return true;
    }
    return "Please enter a number greater than zero.";
}

function validProductID(id) {
    return new Promise((resolve, reject) => {
        connection.query("SELECT product_name FROM products WHERE item_id = ?", [id], (err, res) => {
            if (err) throw err;
            if (res.length > 0) {
                resolve(true);
            } else {
                reject("Please enter a valid product id.");
            }
        });
    });
}

module.exports = {
    integerGreaterThanZero,
    validProductID,
};
