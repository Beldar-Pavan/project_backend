class ApiError extends Error {
    constructor ( 
        statuscode,
        message = "something went wrong, please try again",
        errors = [],
        stack = ""
    ) {
        super(message)
        this.statuscode = statuscode
        this.data = null
        this.message = message
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructer)
        }
    }
}

export { ApiError }