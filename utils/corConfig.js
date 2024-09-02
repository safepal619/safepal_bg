
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5173',
    'https://localhost:5173',
    'http://localhost:3000',
    'http://localhost:3000',
    'https://localhost:3000',
    'localhost:5173',
    'http://127.0.0.1:3000',
    // 'https://safepal-bg.onrender.com/', //front-end website
    // 'https://safepal-bg.onrender.com/', //front-end website
    "https://safepal.onrender.com/",
    "https://safepal.onrender.com",
    "http://safepal.onrender.com/",
    "http://safepal.onrender.com",
    
 "https://safepal.onrender.com"
]


exports.corsConfigs = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            // remove ||!origin to block postman request
            callback(null, true)
        } else {
            callback(new Error('origin not allowed by Cors'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
}
