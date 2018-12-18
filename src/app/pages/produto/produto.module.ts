import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ProdutoRoutingModule, routedComponents } from './produto-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialogModule, MatFormField, MatNativeDateModule,
  MatButtonModule, MatFormFieldModule, MatInputModule, MatRippleModule,
  MatSortModule, MatToolbarModule, MatPaginatorModule,
} from '@angular/material';
import { DeleteDialogComponent } from './produto-list/dialogs/delete/delete.dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditDialogComponent } from './produto-list/dialogs/edit/edit.dialog.component';

@NgModule({
  imports: [
    ThemeModule,
    ProdutoRoutingModule,
    HttpClientModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    FormsModule,
    MatSortModule,
    MatToolbarModule,
    MatPaginatorModule,
    ReactiveFormsModule,
  ],
  entryComponents: [DeleteDialogComponent, EditDialogComponent], // Necessário para fazer aparecer o Dialog
  declarations: [...routedComponents, DeleteDialogComponent, EditDialogComponent],

})
export class ProdutoModule { }
