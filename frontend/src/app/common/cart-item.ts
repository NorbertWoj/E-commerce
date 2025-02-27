import { Product } from "./product";

export class CartItem {
    
    constructor(product: Product) {
        this.id = product.id;
        this.name = product.name;
        this.imageUrl = product.imageUrl;
        this.unitPrice = product.unitPrice;
        this.quantity = 1;
    }

    public id: number;
    public name: string;
    public imageUrl: string;
    public unitPrice: number;
    public quantity: number;
}