"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable security/detect-object-injection */
/* eslint-disable no-param-reassign */
const mongoose_1 = require("mongoose");
const paginate = (schema) => {
    schema.static('paginate', async function (filter, options) {
        var _a, _b;
        let sort = { created_at: -1 }; // Sort by 'createdAt' in descending order by default
        if (options.sortBy) {
            sort = options.sortBy
                .split(',')
                .map((sortOption) => {
                const [key, order] = sortOption.split(':');
                return { [key]: order === 'desc' ? -1 : 1 };
            })
                .reduce((prev, current) => Object.assign(prev, current), {});
        }
        if (!sort.created_at) {
            sort = Object.assign(Object.assign({}, sort), { created_at: -1 }); // Ensure 'createdAt' is sorted in descending order
        }
        if (options.search) {
            const searchFields = Object.keys(this.schema.obj);
            const searchValue = options.search.toLowerCase();
            const orConditions = searchFields
                .map((field) => {
                var _a, _b, _c;
                if (((_a = this.schema.paths[field]) === null || _a === void 0 ? void 0 : _a.instance) === 'ObjectID') {
                    return mongoose_1.Types.ObjectId.isValid(searchValue) ? { [field]: new mongoose_1.Types.ObjectId(searchValue) } : null;
                }
                if (((_b = this.schema.paths[field]) === null || _b === void 0 ? void 0 : _b.instance) === 'Boolean') {
                    const searchBoolean = searchValue === 'true' ? true : searchValue === 'false' ? false : null;
                    return searchBoolean !== null ? { [field]: searchBoolean } : null;
                }
                if (((_c = this.schema.paths[field]) === null || _c === void 0 ? void 0 : _c.instance) === 'Number') {
                    return Number.isNaN(Number(searchValue)) ? null : { [field]: Number(searchValue) };
                }
                return {
                    [field]: new RegExp(`\\b\\w{0,2}\\s*${searchValue}\\w*\\b`, 'i'),
                };
            })
                .filter(condition => condition !== null);
            filter = { $or: orConditions };
        }
        const select = options.selectedFieldsToIncludeOrHide
            ? options.selectedFieldsToIncludeOrHide
                .split(',')
                .map((projectOption) => {
                const [key, include] = projectOption.split(':');
                return (include === 'hide' ? '-' : '') + key;
            })
                .join(' ')
            : '-password -updatedAt';
        const limit = Math.max(parseInt((_a = options.limit) === null || _a === void 0 ? void 0 : _a.toString(), 10) || 2, 1);
        const page = Math.max(parseInt((_b = options.page) === null || _b === void 0 ? void 0 : _b.toString(), 10) || 1, 1);
        const skip = (page - 1) * limit;
        const startIndex = skip;
        const endIndex = page * limit;
        const countPromise = this.countDocuments(filter).exec();
        let documentsPromise = this.find(filter).sort(sort).skip(skip).limit(limit).select(select);
        if (options.populate) {
            options.populate.split(',').forEach((populateOption) => {
                documentsPromise = documentsPromise.populate(populateOption
                    .split('.')
                    .reverse()
                    .reduce((a, b) => ({ path: b, populate: a })));
            });
        }
        documentsPromise = documentsPromise.exec();
        return Promise.all([countPromise, documentsPromise])
            .then(values => {
            const [countOfFilteredDocuments, results] = values;
            const totalPages = Math.ceil(countOfFilteredDocuments / limit);
            const currentPage = page;
            let next;
            let prev;
            if (endIndex < countOfFilteredDocuments) {
                next = { page: page + 1, limit };
            }
            if (startIndex > 0 && page <= totalPages) {
                prev = { page: page - 1, limit };
            }
            return {
                results,
                currentPage,
                limit,
                totalPages,
                countOfFilteredDocuments,
                skip,
                next,
                prev,
            };
        })
            .catch(err => Promise.reject(err));
    });
};
exports.default = paginate;
//# sourceMappingURL=paginate.js.map