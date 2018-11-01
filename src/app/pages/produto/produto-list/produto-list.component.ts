import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { DeleteDialogComponent } from './dialogs/delete/delete.dialog.component';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProdutoService } from '../../../../services/produto/produto.service';
import { Produto } from '../../../../services/produto/produto';
import { EditDialogComponent } from './dialogs/edit/edit.dialog.component';
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
    public dataService: ProdutoService) { }

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
  startEdit(i: number, idProduto: number, descProduto: string, codigoBarras: number, qtdEstoque: number, precoVenda: number, precoCompra: number, ) {
    this.idProduto = idProduto;
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: { idProduto: idProduto, descProduto: descProduto, codigoBarras: codigoBarras, qtdEstoque: qtdEstoque, precoVenda: precoVenda, precoCompra: precoCompra }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.produtoService.dataChange.value.findIndex(x => x.idProduto === this.idProduto);
        // Then you update that record using data from dialogData (values you enetered)
        this.produtoService.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        this.refreshTable();
      }
    });
  }

  deleteItem(i: number, idProduto: number, descProduto: string, codigoBarras: number) {
    this.index = i;
    this.idProduto = idProduto;
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { idProduto: idProduto, descProduto: descProduto, codigoBarras: codigoBarras }
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
    // https://github.com/marinantonio/angular-mat-table-crud/issues/12
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  public loadData() {
    this.produtoService = new ProdutoService(this.httpClient);
    this.dataSource = new ProdutoDataSource(this.produtoService, this.paginator, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup')
      // .debounceTime(150)
      // .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }
}
export class ProdutoDataSource extends DataSource<Produto> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Produto[] = [];
  renderedData: Produto[] = [];

  constructor(public _exampleDatabase: ProdutoService,
    public _paginator: MatPaginator,
    public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Produto[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._exampleDatabase.getAllProdutos();

    return merge(...displayDataChanges).pipe(map(() => {
      // Filter data
      this.filteredData = this._exampleDatabase.data.slice().filter((produto: Produto) => {
        const searchStr = (produto.idProduto + produto.descProduto + produto.codigoBarras).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });

      // Sort filtered data
      const sortedData = this.sortData(this.filteredData.slice());

      // Grab the page's slice of the filtered sorted data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    }
    ));
  }

  disconnect() { }

  /** Returns a sorted copy of the database data. */
  sortData(data: Produto[]): Produto[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'idProduto': [propertyA, propertyB] = [a.idProduto, b.idProduto]; break;
        case 'descProduto': [propertyA, propertyB] = [a.descProduto, b.descProduto]; break;
        case 'codigoBarras': [propertyA, propertyB] = [a.codigoBarras, b.codigoBarras]; break;
        case 'precoCompra': [propertyA, propertyB] = [a.precoCompra, b.precoCompra]; break;
        case 'precoVenda': [propertyA, propertyB] = [a.precoVenda, b.precoVenda]; break;
        case 'qtdEstoque': [propertyA, propertyB] = [a.qtdEstoque, b.qtdEstoque]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}