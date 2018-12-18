import { Produto } from '../produto/produto';

export interface Item {

    id: number;
    totalPrice: number;
    quantity: number;
    discount: number;
    tax: number;
    product: Produto;

}
