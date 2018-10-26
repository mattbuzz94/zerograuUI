import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ProdutoRoutingModule,routedComponents } from './produto-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
@NgModule({
  imports: [
    ThemeModule,
    ProdutoRoutingModule,
    HttpClientModule,
    MatTableModule,
    MatIconModule,
  ],
  declarations: [...routedComponents,]
})
export class ProdutoModule { }
