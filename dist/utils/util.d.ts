/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export declare const isEmpty: (value: string | number | object) => boolean;
export declare class SuccessResponse {
    status: number;
    data: any;
    constructor(data: any, status?: number);
}
