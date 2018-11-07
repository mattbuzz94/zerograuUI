import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Venda } from '../../../services/venda/venda';
import { VendaService } from '../../../services/venda/venda.service';
import { ToastrService } from 'ngx-toastr';
import {
  map,
  catchError,
  first
} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ProdutoService } from '../../../services/produto/produto.service';
import { Produto, Produtos } from '../../../services/produto/produto';

@Component({
  selector: 'venda',
  templateUrl: './venda.component.html',
  styleUrls: ['./venda.component.scss']
})
export class VendaComponent implements OnInit {

  public produtoAutoComplete: Observable<Produtos> = null;
  public vendaForm = new FormControl();
  vendas: Venda[] = [];
  results: any[];
  produtos: Produtos;
  isLoading = false;

  constructor(private vendasService: VendaService, private produtoService: ProdutoService, private toastr: ToastrService) { }

  lookup(value: string): Observable<Produtos> {
    return this.produtoService.search(value.toLowerCase()).pipe(
      // map the item property of the github results as our return object
      map(results => results.produtos),
      // catch errors
      catchError(_ => {
        return of(null);
      })
    );
  }

  ngOnInit() {/*
    this.produtoAutoComplete = this.vendaForm.valueChanges.pipe(
      startWith(''),
      // delay emits
      debounceTime(300),    
      switchMap(value => {
        if (value !== '') {          
          return this.lookup(value);
        } else {
          // if no value is pressent, return null
          return of(null);
        }
      })
    );*/
    this.vendaForm.valueChanges.subscribe(
      term => {
        if (term != '') {
          this.produtoService.search1(term).subscribe(
            data => {
              this.results = data as any[];
              //console.log(data[0].BookName);
          })
        }
    })
  }
  
  

  filter(val: string): Produtos {

    return this.produtos.filter(x =>
      x.descProduto.toUpperCase().indexOf(val.toUpperCase()) !== -1);
  }


  displayFn(produto: Produto) {
    if (produto) { return produto.descProduto; }
  }

  fetchDataFromService() {
    this.vendasService.getVendas().subscribe(vendas => this.vendas = vendas);
  }

  save(): void {
    this.vendasService.addVenda(this.vendaForm.value)
      .pipe(first())
      .subscribe(
        () => {
          console.log('Sucess');
          this.showSuccess();
        },
        () => {
          console.log('Erro');
          this.showError();
          this.isLoading = false;
        });
  }

  showSuccess() {
    this.toastr.success('Sucesso!', 'Cadastrado com sucesso!', {
      timeOut: 3000
    });
  }
  showError() {
    this.toastr.error('Erro', 'Venda não cadastrado!', {
      timeOut: 3000
    });
  }

}
