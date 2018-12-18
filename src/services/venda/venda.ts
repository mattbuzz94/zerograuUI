import { Item } from './item';

export interface Venda {

    idVenda: number;
    valorTotal: number;
    formaPagamento: string;
    item: [Item];

}
