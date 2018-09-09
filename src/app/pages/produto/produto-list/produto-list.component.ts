import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Produto } from '../../../../services/produto/produto';
import { ProdutoService } from '../../../../services/produto/produto.service';

@Component({
  selector: 'produto-list',
  templateUrl: './produto-list.component.html',
  styleUrls: ['./produto-list.component.scss']
})
export class ProdutoListComponent implements OnInit {

  private titulo: string;
  produtos: Produto[] = [];

  constructor(private produtoService: ProdutoService,
    private router: Router) { }

  ngOnInit() {
    /*CHAMA O SERVIÇO E RETORNA TODAS AS PRODUTOS CADASTRADOS */
    this.produtoService.getProdutos().subscribe(products => this.produtos = products);
  }
}
