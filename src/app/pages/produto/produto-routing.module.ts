import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProdutoComponent } from './produto.component';
import { ProdutoInputComponent } from './produto-input/produto-input.component';
import { ProdutoListComponent } from './produto-list/produto-list.component';


const routes: Routes = [{
  path: '',
  component: ProdutoComponent,
  children: [{
    path: 'cadastro',
    component: ProdutoInputComponent,
  }, {
    path: 'consulta',
    component: ProdutoListComponent,
  }],
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class ProdutoRoutingModule {

}

export const routedComponents = [
  ProdutoComponent,
  ProdutoInputComponent,
  ProdutoListComponent,
];
