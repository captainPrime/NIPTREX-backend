import { Schema, Document } from 'mongoose';
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
declare const paginate: (schema: Schema) => void;
export default paginate;
