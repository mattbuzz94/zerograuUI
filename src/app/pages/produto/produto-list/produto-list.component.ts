import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Produto } from '../../../../services/produto/produto';
import { ProdutoService } from '../../../../services/produto/produto.service';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { ToastrService } from 'ngx-toastr';
//import { MatSnackBar, MatDialog, MatTableDataSource } from '@angular/material';
//import { connect } from 'net';

@Component({
  selector: 'produto-list',
  templateUrl: './produto-list.component.html',
  styleUrls: ['./produto-list.component.scss']
})
export class ProdutoListComponent implements OnInit {
  dataSource = new ProdutoDataSource(this.produtoService);
  displayedColumns = ['idProduto', 'descProduto', 'precoCompra', 'precoVenda', 'actions'];
  produtos: Produto[] = [];
  //dataSource1 = new MatTableDataSource<Produto>();
  constructor(private produtoService: ProdutoService,
    private toastr: ToastrService,
    //private dialog: MatDialog,
    private router: Router) { }

  onDelete(idProduto: number): void {
    //this.produtos = this.produtos.filter(h => h !== hero);
    this.produtos = this.produtos.filter(item => item.idProduto != idProduto);
    this.produtoService.deleteProduto(idProduto).subscribe(
      data => {
        console.log('Sucess');
        this.showSuccess();
      },
      error => {
        console.log('Erro');
        this.showError();
      });
    this.dataSource.connect();
  }
  showSuccess() {
    this.toastr.success('Sucesso!', 'Produto Excluído', {
      timeOut: 3000
    });
  }
  showError() {
    this.toastr.error('Erro', 'Produto não deletado!', {
      timeOut: 3000
    });
  }
  ngOnInit() {
    //this.dataSource.connect();
  }
  refresh() {
   // this.produtoService.getProdutos().subscribe(data: MyDataType[] => {
     // this.dataSource.data = data});
     this.produtoService.getProdutos().subscribe(products => this.produtos = products);
  }
}

export class ProdutoDataSource extends DataSource<any> {

  constructor(private produtoService: ProdutoService) {
    super();
  }

  connect(): Observable<Produto[]> {
    return this.produtoService.getProdutos();
  }

  disconnect() { }
}
