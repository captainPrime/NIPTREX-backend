const swaggerDocs = {
    swagger: "2.0",
    info: {
        title: "Niptrex API Documentation for User Signup and Signin",
        version: "1.0",
        description: "Testing Niptrex Users & Freelancers API Endpoints",
    },
    basePath: "/v1",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    definitions: {
        User: {
            type: "object",
            properties: {
                first_name: {
                    type: "string",
                    description: "First name of the user.",
                },
                last_name: {
                    type: "string",
                    description: "Last name of the user.",
                },
                email: {
                    type: "string",
                    format: "email",
                    description: "Email of the user.",
                },
                password: {
                    type: "string",
                    description: "Password of the user.",
                },
                country: {
                    type: "string",
                    description: "Country of the user.",
                },
            },
        },
        Token: {
            type: "object",
            properties: {
                token: {
                    type: "string",
                    description: "JWT token for authentication.",
                },
            },
        },
        SuccessResponse: {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        user: {
                            $ref: "#/definitions/User",
                        },
                        token: {
                            $ref: "#/definitions/Token",
                        },
                    },
                    description: "Object containing user information and authentication token.",
                },
                status: {
                    type: "string",
                    description: "Status of the response.",
                    enum: ["SUCCESS"],
                },
                message: {
                    type: "string",
                    description: "Message describing the response.",
                    example: "Signup successful",
                },
                response_code: {
                    type: "integer",
                    description: "HTTP response code.",
                },
            },
        },
        ErrorResponse: {
            type: "object",
            properties: {
                status: {
                    type: "string",
                    description: "Status of the response.",
                    enum: ["FAILED"],
                },
                message: {
                    type: "string",
                    description: "Message describing the response.",
                    example: "Invalid credentials entered",
                },
                response_code: {
                    type: "integer",
                    description: "HTTP response code.",
                },
            },
        },
    },
    paths: {
        "/user/signup": {
            post: {
                summary: "Signup a new user.",
                consumes: ["application/json"],
                produces: ["application/json"],
                parameters: [
                    {
                        name: "body",
                        in: "body",
                        description: "User information to create an account.",
                        required: true,
                        schema: {
                            $ref: "#/definitions/User",
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "Signup successful.",
                        schema: {
                            $ref: "#/definitions/SuccessResponse",
                        },
                    },
                    400: {
                        description: "Invalid request body.",
                        schema: {
                            $ref: "#/definitions/ErrorResponse",
                        },
                    },
                    409: {
                        description: "User with the provided email already exists.",
                        schema: {
                            $ref: "#/definitions/ErrorResponse",
                        },
                    },
                },
            },
        },
        "/user/signin": {
            post: {
                summary: "Signin a user.",
                consumes: ["application/json"],
                produces: ["application/json"],
                parameters: [
                    {
                        name: "body",
                        in: "body",
                        description: "User information to signin.",
                        required: true,
                        schema: {
                            $ref: "#/definitions/UserSignIn",
                        },
                    },
                ],
                responses: {
                    200: {
                        description: "Signin successful.",
                        schema: {
                            $ref: "#/definitions/SuccessResponse",
                        },
                    },
                    400: {
                        description: "Invalid request body.",
                        schema: {
                            $ref: "#/definitions/ErrorResponse",
                        },
                    },
                    401: {
                        description: "Invalid email or password.",
                        schema: {
                            $ref: "#/definitions/ErrorResponse",
                        },
                    },
                },
            },
        },
    },
};

export default swaggerDocs;
