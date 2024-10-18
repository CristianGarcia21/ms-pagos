class ResponseHandler {
    static success(res, data, message = 'Operation successful', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    static error(res, error, statusCode = 400) {
        return res.status(statusCode).json({
            success: false,
            message: error.message || 'An error occurred',
            error: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }

    static notFound(res, message = 'Resource not found') {
        return res.status(404).json({
            success: false,
            message
        });
    }

    static badRequest(res, message = 'Bad request', errors = null) {
        return res.status(400).json({
            success: false,
            message,
            errors
        });
    }

    static unauthorized(res, message = 'Unauthorized access') {
        return res.status(401).json({
            success: false,
            message
        });
    }
}

module.exports = ResponseHandler;