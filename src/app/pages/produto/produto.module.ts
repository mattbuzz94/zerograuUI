import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ProdutoRoutingModule,routedComponents } from './produto-routing.module';

@NgModule({
  imports: [
    ThemeModule,
    ProdutoRoutingModule,
  ],
  declarations: [...routedComponents,]
})
export class ProdutoModule { }
