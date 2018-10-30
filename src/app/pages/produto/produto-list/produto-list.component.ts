import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatDialog, MatPaginator, MatSort} from '@angular/material';
import {DataSource} from '@angular/cdk/collections';
import {DeleteDialogComponent} from './dialogs/delete/delete.dialog.component';
import {BehaviorSubject, fromEvent, merge, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { ProdutoService } from '../../../../services/produto/produto.service';
import { Produto } from '../../../../services/produto/produto';



export interface DialogData {
  idproduto: number;
}
@Component({
  selector: 'produto-list',
  templateUrl: './produto-list.component.html',
  styleUrls: ['./produto-list.component.scss']
})
export class ProdutoListComponent implements OnInit {
  //dataSource = new ProdutoDataSource(this.produtoService);
  displayedColumns = ['idProduto', 'descProduto', 'precoCompra', 'precoVenda', 'actions'];
  produtos: Produto[] = [];
  idProduto: number;
  index: number;

  produtoService: ProdutoService | null;
  dataSource: ProdutoDataSource | null;
  
  constructor(public httpClient: HttpClient,
              public dialog: MatDialog,
              public dataService: ProdutoService) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  onRowClicked(row) {
    this.idProduto = row.idProduto;
    console.log('Row clicked: ', row);
  }
 /* addNew(produto: Produto) {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      data: {produto: produto }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside ProdutoService
        this.produtoService.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });
  }

  startEdit(i: number, id: number, title: string, state: string, url: string, created_at: string, updated_at: string) {
    this.id = id;
    // index row is used just for debugging proposes and can be removed
    this.index = i;
    console.log(this.index);
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {id: id, title: title, state: state, url: url, created_at: created_at, updated_at: updated_at}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside ProdutoService by id
        const foundIndex = this.produtoService.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
        this.produtoService.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        this.refreshTable();
      }
    });
  }*/

  deleteItem(i: number, idProduto: number, descProduto: string, codigoBarras: number) {
    this.index = i;
    this.idProduto = idProduto;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {idProduto: idProduto, descProduto: descProduto, codigoBarras: codigoBarras}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.produtoService.dataChange.value.findIndex(x => x.idProduto === this.idProduto);
        // for delete we use splice in order to remove single object from ProdutoService
        this.produtoService.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }


  private refreshTable() {
    // Refreshing table using paginator
    // Thanks yeager-j for tips
    // https://github.com/marinantonio/angular-mat-table-crud/produtos/12
   // this.paginator._changePageSize(this.paginator.pageSize);
  }


  /*   // If you don't need a filter or a pagination this can be simplified, you just use code from else block
    // OLD METHOD:
    // if there's a paginator active we're using it for refresh
    if (this.dataSource._paginator.hasNextPage()) {
      this.dataSource._paginator.nextPage();
      this.dataSource._paginator.previousPage();
      // in case we're on last page this if will tick
    } else if (this.dataSource._paginator.hasPreviousPage()) {
      this.dataSource._paginator.previousPage();
      this.dataSource._paginator.nextPage();
      // in all other cases including active filter we do it like this
    } else {
      this.dataSource.filter = '';
      this.dataSource.filter = this.filter.nativeElement.value;
    }*/



  public loadData() {
    this.produtoService = new ProdutoService(this.httpClient);
    this.dataSource = new ProdutoDataSource(this.produtoService);//, this.paginator, this.sort);
    /*fromEvent(this.filter.nativeElement, 'keyup')
      // .debounceTime(150)
      // .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  */}
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
