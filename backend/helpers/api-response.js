export const success = (request, response, message = "success", options) => {
    response.status(200).json({
        data: {
            ...options,
        },
        message: message,
        error: false,
        success: true,
    });
};

export const internalServerError = (request, response, err, message) => {
    response.status(500).json({
        err,
        message,
        error: true,
        success: false,
    });
};

export const badRequest = (request, response, err, message) => {
    response.status(400).json({
        err,
        message,
        error: true,
        success: false,
    });
};

export const unauthorized = (req, res, error = null, message = "Unauthorized access") => {
    res.status(401).json({
        error: true,
        message: message,
        err: error || {},
        success: false
    });
};
