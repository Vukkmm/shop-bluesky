import { Product } from "./Product";

export class ImageDTO {
  'imageId': number;
  'product': Product;
  'file': string;
  constructor(imageId: number, product: Product, file: string) {
    this.imageId = imageId;
    this.product = product;
    this.file = file;
  }
}
