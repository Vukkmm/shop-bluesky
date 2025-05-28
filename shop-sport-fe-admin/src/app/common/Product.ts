import { Category } from "./Category";

export class Product {
    'productId': number;
    'name': string;
    'quantity': number; // số lượng
    'price': number;
    'discount': number;
    'image': string;
    'description': string;
    'enteredDate': Date;
    'category': Category;
    'status': boolean;
    'sold': number; // lượt đánh giá sp
    'branch': string;
    'material': string;
    'size': string;
    // 'imageBase64': string;

    // constructor(productId: number, imageBase64: string) {
    //     this.productId = productId;
    //     this.imageBase64 = imageBase64;
    // }
}
