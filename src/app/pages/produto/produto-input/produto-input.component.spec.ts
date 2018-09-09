import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoInputComponent } from './produto-input.component';

describe('ProdutoInputComponent', () => {
  let component: ProdutoInputComponent;
  let fixture: ComponentFixture<ProdutoInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProdutoInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdutoInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
