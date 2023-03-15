import { RequestHandler, Response, Request } from "express";

export class ProductController {
  public productService: ProductService = new ProductService();
  constructor() {}

  public createProduct: RequestHandler = async (req: Response, res: Request, next) => {
    try {
      const product = await this.productService.createProduct(
      req.body,
      req.file
    );

    return res.status(201).json({ success: true, product });
    } catch (err) {
      next(err)
    }
  };

  getProducts: RequestHandler = async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit as string);
      const skip = parseInt(req.query.skip as string);
      const products = await this.productService.queryProducts(limit, skip);

      return res
        .status(200)
        .json({ success: true, count: products.length, products });
    } catch (error) {
      next(error);
    }
  };

  getProduct: RequestHandler = async (req, res, next) => {
    try {
      const product = await this.productService.getProduct(req.params.id);
      return res.status(200).json({ success: true, product });
    } catch (error) {
      next(error);
    }
  };

  updateProduct: RequestHandler = async (req, res, next) => {
    try {
      const product = await this.productService.updateProduct(
        req.params.id,
        req.body,
        req.file
      );
      return res.status(200).json({ success: true, product });
    } catch (error) {
      next(error);
    }
  };

  deleteProduct: RequestHandler = async (req, res, next) => {
    try {
      await this.productService.deleteProduct(req.params.id);
      return res.status(200).json({ success: true, data: {} });
    } catch (error) {
      next(error);
    }
  };
}