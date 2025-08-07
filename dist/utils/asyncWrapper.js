"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncWrapper = void 0;
const asyncWrapper = (handler) => (req, res, next) => {
    Promise.resolve(handler(req, res, next))
        .then((response) => res.status(response.status).send({
        status: response.status,
        data: response.data,
    }))
        .catch(err => next(err));
};
exports.asyncWrapper = asyncWrapper;
//# sourceMappingURL=asyncWrapper.js.map