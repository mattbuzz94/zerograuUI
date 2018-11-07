import { Produto } from "../produto/produto";
import { Venda } from "./venda";

export class Item{

    id: number;
    totalPrice: number;
    quantity: number;
    discount: number;
    tax: number;
    product: Produto;

}