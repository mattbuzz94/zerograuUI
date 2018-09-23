export class Produto {


    constructor(
        
        public descProduto = '',
        public precoVenda: number,        
        public codigoBarras: number,
        public precoCompra?: number,
        public idProduto?: number,
        public qtdEstoque?: number) { }

}