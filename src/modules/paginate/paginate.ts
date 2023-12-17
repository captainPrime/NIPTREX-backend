/* eslint-disable security/detect-object-injection */
/* eslint-disable no-param-reassign */
import { Schema, Document, Types } from 'mongoose';

interface Pagination {
  page: any;
  limit: any;
}

export interface QueryResult {
  results: Document[];
  currentPage: number;
  limit: number;
  totalPages: number;
  countOfFilteredDocuments: number;
  next?: Pagination | undefined;
  prev?: Pagination | undefined;
}

export interface IOptions {
  sortBy?: string;
  selectedFieldsToIncludeOrHide?: string;
  populate?: string;
  search?: string;
  limit?: any;
  skip?: any;
  page?: any;
}

const paginate = (schema: Schema) => {
  schema.static('paginate', async function (filter: Record<string, any>, options: IOptions): Promise<QueryResult> {
    let sort = '-createdAt';

    if (options.sortBy) {
      sort = options.sortBy
        .split(',')
        .map((sortOption: string) => {
          const [key, order] = sortOption.split(':');
          return (order === 'desc' ? '-' : '') + key;
        })
        .join(' ');
    }

    if (options.search) {
      const searchFields = Object.keys(this.schema.obj);
      const searchValue = options.search.toLowerCase();

      const orConditions = searchFields
        .map((field: string) => {
          if (this.schema.paths[field]?.instance === 'ObjectID') {
            return Types.ObjectId.isValid(searchValue) ? { [field]: new Types.ObjectId(searchValue) } : null;
          }

          if (this.schema.paths[field]?.instance === 'Boolean') {
            const searchBoolean = searchValue === 'true' ? true : searchValue === 'false' ? false : null;
            return searchBoolean !== null ? { [field]: searchBoolean } : null;
          }

          if (this.schema.paths[field]?.instance === 'Number') {
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
          .map((projectOption: string) => {
            const [key, include] = projectOption.split(':');
            return (include === 'hide' ? '-' : '') + key;
          })
          .join(' ')
      : '-password -updatedAt';

    const limit = Math.max(parseInt(options.limit?.toString(), 10) || 2, 1);
    const page = Math.max(parseInt(options.page?.toString(), 10) || 1, 1);
    const skip = (page - 1) * limit;
    const startIndex = skip;
    const endIndex = page * limit;

    const countPromise = this.countDocuments(filter).exec();
    let documentsPromise = this.find(filter).sort(sort).skip(skip).limit(limit).select(select);

    if (options.populate) {
      options.populate.split(',').forEach((populateOption: any) => {
        documentsPromise = documentsPromise.populate(
          populateOption
            .split('.')
            .reverse()
            .reduce((a: string, b: string) => ({ path: b, populate: a })),
        );
      });
    }

    documentsPromise = documentsPromise.exec();

    return Promise.all([countPromise, documentsPromise])
      .then(values => {
        const [countOfFilteredDocuments, results] = values;
        const totalPages = Math.ceil(countOfFilteredDocuments / limit);
        const currentPage = page;
        let next: Pagination | undefined;
        let prev: Pagination | undefined;

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

export default paginate;
