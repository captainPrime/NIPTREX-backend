const swaggerDocs = {
    openapi: "3.0.0",
    info: {
        title: "Niptrex API Documentation",
        version: "1.0",
        description: "Testing Niptrex Users & Freelancers API Endpoints",
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Local Development",
        },
        {
            url: "http://niptrex-endpoint.cyclic.app",
            description: "Production Development",
        },
    ],
    tags: [
        {
            name: "User",
            description: "User Routes",
        },
    ],
    paths: {
        "/v1/user/signup": {
            post: {
                tags: ["User"],
                description: "Make Post request vis User details",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schemas: {
                                fname: String,
                                lname: String,
                                email: String,
                                password: String,
                                country: String,
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: "OK",
                        content: {
                            "application/json": {
                                type: "object",
                                example: {
                                    data: [],
                                    status: "Signin successful",
                                    message: "SUCCESS",
                                    response_code: 200,
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

export default swaggerDocs;
