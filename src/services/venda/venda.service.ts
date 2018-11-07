import { throwError as observableThrowError, Observable, throwError, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Venda } from './venda';

const API_URL = environment.apiUrl;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }), responseType: 'text' as 'json'
};


@Injectable({
  providedIn: 'root'
})
export class VendaService {
  private vendaUrl = API_URL + 'venda/';  // URL to web api
  dataChange: BehaviorSubject<Venda[]> = new BehaviorSubject<Venda[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  constructor(private httpClient: HttpClient) { }

  get data(): Venda[] {
    return this.dataChange.value;
  }
  getDialogData() {
    return this.dialogData;
  }
  /*getVendaNo404<Data>(id: number): Observable<Venda> {
    const url = `${this.vendaUrl}/?id=${id}`;
    return this.httpClient.get<Venda[]>(url)
      .pipe(
        map(vendas => vendas[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} venda id=${id}`);
        }),
        catchError(this.handleError<Venda>(`getVenda id=${id}`))
      );
  }
  getUser(): Observable<Venda[]> {
    return this.httpClient.get('/api/user')
      .map((res: Response) => res.json().response.map((user: User) => new User().deserialize(user)));
  }*/
  /** POST: add a new venda to the server */
  addVenda(venda: Venda): Observable<Venda> {

    return this.httpClient.post<Venda>(this.vendaUrl, venda, httpOptions)
      .pipe(
        tap((venda: Venda) => console.log(`added venda w/ id=${venda.idVenda}`)),
        catchError(this.handleError)
      );
  }

  /** DELETE: delete the venda from the server */
  deleteVenda(venda: Venda | number): Observable<Venda> {
    const id = typeof venda === 'number' ? venda : venda.idVenda;
    const url = `${this.vendaUrl}${id}`;

    return this.httpClient.delete<Venda>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted venda id=${id}`)),
      catchError(this.handleError)
    );
  }

  /** PUT: update the venda on the server
  updateVenda(venda: Venda): Observable<any> {
    return this.httpClient.put(this.vendaUrl, venda, httpOptions).pipe(
      tap(_ => console.log(`updated venda id=${venda.idVenda}`)),
      catchError(this.handleError)
    );
  } */
  // UPDATE, PUT METHOD
  updateProduct(venda: Venda): void {
    this.httpClient.put(this.vendaUrl + venda.idVenda, venda).subscribe(data => {
      this.dialogData = venda;
    },
      (err: HttpErrorResponse) => {
        catchError(this.handleError)
      }
    );
  }

  // API: GET /Vendas
  getVendas(): Observable<Venda[]> {
    return this.httpClient.get<Venda[]>(this.vendaUrl)
      .pipe(
        tap(Vendas => {
          console.log('Vendas fetched...');
          console.log(Vendas);
        }),
        catchError(this.handleError)
      );
  }

  /** CRUD METHODS */
  getAllVendas(): void {
    this.httpClient.get<Venda[]>(this.vendaUrl).subscribe(data => {
      this.dataChange.next(data);
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }

  public getVendasBusca(textoBusca: string, projeto: string): Observable<Venda[]> {
    const url = `${API_URL}busca/?textoBusca='${textoBusca}/?modulo='${projeto}`;
    return this.httpClient.get<Venda[]>(url).pipe(
      tap(Vendas => {
        console.log(`fetched Venda id=${textoBusca}`);
        console.log(Vendas);
      }),
      catchError(this.handleError)
    );
  }
  getVenda(id: number): Observable<Venda> {
    const url = `${API_URL}/${id}`;
    return this.httpClient.get<Venda>(url).pipe(
      tap(_ => console.log(`fetched Venda id=${id}`)),
      catchError(this.handleError)
    );
  }
  getRepos(textoBusca: string, modulo: string): Observable<Venda[]> {
    // tslint:disable-next-line:prefer-const
    let params = new HttpParams()
      .set('textoBusca', textoBusca)
      .set('modulo', modulo);
    console.log(params.toString());
    return this.httpClient.get<Venda[]>(API_URL + 'Venda/busca/', { params });
  }

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
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}
