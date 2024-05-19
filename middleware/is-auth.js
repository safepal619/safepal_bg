const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const Authorization = req.get("Authorization")

    if (!Authorization) {
        const error = new Error("user not authenticated");
        error.statusCode = 401;
        throw error
    }
    const token = Authorization.split(" ")[1]
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, "Propverse_Houseverse_Secret")
    } catch (error) {
        error.statusCode = 500;
        throw error
    }

    if (!decodedToken) {
        const error = new Error("user not authenticated");
        error.statusCode = 401;
        throw error
    }

    req.userId = decodedToken.userId;
    next()


}