import { throwError as observableThrowError, Observable, throwError, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap, debounceTime } from 'rxjs/operators';
import { Produto, IProdutoResponse } from './produto';

const API_URL = environment.apiUrl;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }), responseType: 'text' as 'json'
};


@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private produtoUrl = API_URL + 'produto/';  // URL to web api
  dataChange: BehaviorSubject<Produto[]> = new BehaviorSubject<Produto[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  produtos: Produto[] = [];
  constructor(private httpClient: HttpClient) { }

  search1(term) {
    const params = new HttpParams()
      .set('descProduto', term)
      .set('codigoBarras', '123');
      var listOfBooks= this.httpClient.get(this.produtoUrl + 'busca/', { params })
      .pipe(
        debounceTime(500),  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
        map(
          (data: any) => {
            return (
              data.length != 0 ? data as any[] : [{ "BookName": "No Record Found" } as any]
            );
          }
        ));
    

    return listOfBooks;
  }
// Esse método funcionan para retornar o json porém não exibe no html
  search(query: string): Observable<IProdutoResponse> {
    return this.httpClient
      .get<IProdutoResponse>(this.produtoUrl + 'busca/', {
        observe: 'response',
        params: {
          descProduto: query,
          codigoBarras: '123',
        }
      })
      .pipe(
        map(res => {
          console.log(res.body)
          return res.body;
        })
      );
  }

  get data(): Produto[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  setProdutoData(data: Produto[]) {
    this.produtos = data;
  }
  getProdutoData() {
    return this.produtos;
  }
  /*getProdutoNo404<Data>(id: number): Observable<Produto> {
    const url = `${this.produtoUrl}/?id=${id}`;
    return this.httpClient.get<Produto[]>(url)
      .pipe(
        map(produtos => produtos[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} produto id=${id}`);
        }),
        catchError(this.handleError<Produto>(`getProduto id=${id}`))
      );
  }*/

  /** POST: add a new produto to the server */
  addProduto(produto: Produto): Observable<Produto> {

    return this.httpClient.post<Produto>(this.produtoUrl, produto, httpOptions)
      .pipe(
        tap((produto: Produto) => console.log(`added produto w/ id=${produto.idProduto}`)),
        catchError(this.handleError)
      );
  }

  /** DELETE: delete the produto from the server */
  deleteProduto(produto: Produto | number): Observable<Produto> {
    const id = typeof produto === 'number' ? produto : produto.idProduto;
    const url = `${this.produtoUrl}${id}`;

    return this.httpClient.delete<Produto>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted produto id=${id}`)),
      catchError(this.handleError)
    );
  }

  /** PUT: update the produto on the server */
  updateProduto(produto: Produto): Observable<any> {
    return this.httpClient.put(this.produtoUrl, produto, httpOptions).pipe(
      tap(_ => console.log(`updated produto id=${produto.idProduto}`)),
      catchError(this.handleError)
    );
  }
  // UPDATE, PUT METHOD
  updateProduct(produto: Produto): void {
    this.httpClient.put(this.produtoUrl + produto.idProduto, produto).subscribe(data => {
      this.dialogData = produto;
    },
      (err: HttpErrorResponse) => {
        catchError(this.handleError)
      }
    );
  }

  // API: GET /Produtos
  getProdutos(): Observable<Produto[]> {
    return this.httpClient.get<Produto[]>(this.produtoUrl)
      .pipe(
        tap(Produtos => {
          console.log('Produtos fetched...');
          console.log(Produtos);
        }),
        catchError(this.handleError)
      );
  }

  /** CRUD METHODS */
  getAllProdutos(): void {
    this.httpClient.get<Produto[]>(this.produtoUrl).subscribe(data => {
      this.dataChange.next(data);
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  getProduto(id: number): Observable<Produto> {
    const url = `${API_URL}/${id}`;
    return this.httpClient.get<Produto>(url).pipe(
      tap(_ => console.log(`fetched Produto id=${id}`)),
      catchError(this.handleError)
    );
  }
  getProdutoByCodigoBarras(codigoBarras: number, descProduto: string): Observable<Produto[]> {
    const params = new HttpParams()
      .set('descProduto', descProduto)
      .set('codigoBarras', codigoBarras.toString());
    return this.httpClient.get<Produto[]>(this.produtoUrl + 'busca/', { params }).pipe(
      tap(produtos => {
        // tslint:disable-next-line:no-console
        console.log(`codigo de Barras=${codigoBarras}`);
        // tslint:disable-next-line:no-console
        console.log(produtos);
        this.setProdutoData(produtos);
      }),
      catchError(this.handleError)
    );
  }
  // log(message: string) {
  //this.messageService.add(`ProdutoService: ${message}`);
  //}

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a produto-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}