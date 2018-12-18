import { Component, OnInit } from '@angular/core';
import { Produto } from '../../../../services/produto/produto';
import { ProdutoService } from '../../../../services/produto/produto.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ngx-produto-input',
  templateUrl: './produto-input.component.html',
  styleUrls: ['./produto-input.component.scss'],
})
export class ProdutoInputComponent implements OnInit {
  produtoForm: FormGroup;
  produtos: Produto[];
  editProduto: Produto; // the hero currently being edited
  loading = false;
  submitted = false;

  constructor(private fb: FormBuilder, private produtoService: ProdutoService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.produtoForm = this.fb.group({
      descProduto: ['', [Validators.required, Validators.minLength(3)]],
      codigoBarras: ['', [Validators.required, Validators.maxLength(50)]],
      qtdEstoque: '',
      precoVenda: '',
      precoCompra: '',
    });

    /*this.produtoForm.get('notification').valueChanges
      .subscribe(value => this.setNotification(value));*/
  }

  save(): void {
    this.produtoService.addProduto(this.produtoForm.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log('Sucess');
          this.showSuccess();
        },
        error => {
          console.log('Erro');
          this.showError();
          this.loading = false;
        });
  }

  setNotification(notifyVia: string): void {
    const phoneControl = this.produtoForm.get('descProduto');
    if (notifyVia === 'text') {
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  showSuccess() {
    this.toastr.success('Sucesso!', 'Cadastrado com sucesso!', {
      timeOut: 3000,
    });
  }
  showError() {
    this.toastr.error('Erro', 'Produto não cadastrado!', {
      timeOut: 3000,
    });
  }
}
