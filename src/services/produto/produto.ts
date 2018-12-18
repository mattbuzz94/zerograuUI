export class Produto {


    constructor(
        public descProduto = '',
        public precoVenda: number,
        public codigoBarras: number,
        public precoCompra?: number,
        public idProduto?: number,
        public qtdEstoque?: number) { }

}


export declare type Produtos = Produto[];
export interface IProdutoResponse {
    total_count: number;
    incomplete_results: boolean;
    produtos: Produtos;
}

