import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import { ProdutoService } from '../../../../../../services/produto/produto.service';
import {FormControl, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-baza.dialog',
  templateUrl: '../../dialogs/edit/edit.dialog.html',
  styleUrls: ['../../dialogs/edit/edit.dialog.css'],
})
export class EditDialogComponent {

  constructor(public dialogRef: MatDialogRef<EditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public dataService: ProdutoService, public toastr: ToastrService) { }

  formControl = new FormControl('', [
    Validators.required,
    // Validators.email,
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Campo de preenchimento obrigatório' :
      this.formControl.hasError('email') ? 'Not a valid email' :
        '';
  }

  submit() {
    // emppty stuff
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  stopEdit(): void {
    this.dataService.updateProduct(this.data);
    this.showSuccess();
  }

  showSuccess() {
    this.toastr.success('Sucesso!', 'Produto excluído!', {
      timeOut: 3000,
    });
  }
  showError() {
    this.toastr.error('Erro', 'Erro ao excluir produto', {
      timeOut: 3000,
    });
  }
}
