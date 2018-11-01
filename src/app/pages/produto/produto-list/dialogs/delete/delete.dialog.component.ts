import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject } from '@angular/core';
import { ProdutoService } from '../../../../../../services/produto/produto.service';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-delete.dialog',
    templateUrl: '../../dialogs/delete/delete.dialog.html',
    styleUrls: ['../../dialogs/delete/delete.dialog.css']
})
export class DeleteDialogComponent {

    constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, public dataService: ProdutoService,public toastr : ToastrService) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    confirmDelete(): void {
        this.dataService.deleteProduto(this.data.idProduto).subscribe(
            data => {
              console.log('Sucess');
              this.showSuccess();
            },
            error => {
              console.log('Erro');
              this.showError();
            });
         // this.dataSource.connect();;
    }
    showSuccess() {
        this.toastr.success('Sucesso!', 'Produto excluído!', {
          timeOut: 3000
        });
      }
      showError() {
        this.toastr.error('Erro', 'Erro ao excluir produto', {
          timeOut: 3000
        });
      }
}
