import { Category } from "./Category";

export class Product {
    'productId': number;
    'name': string;
    'quantity': number;
    'price': number;
    'discount': number;
    // 'imageBase64': string;
    'description': string;
    'enteredDate': Date;
    'category': Category;
    'status': boolean;
    'sold': number;
    'content': string;
    'size': string;
    'material': string;
    'branch': string;
    'image': string;

    constructor(id: number) {
        this.productId = id;
    }
}
