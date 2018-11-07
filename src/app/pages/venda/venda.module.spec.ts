import { VendaModule } from './venda.module';

describe('VendaModule', () => {
  let vendaModule: VendaModule;

  beforeEach(() => {
    vendaModule = new VendaModule();
  });

  it('should create an instance', () => {
    expect(vendaModule).toBeTruthy();
  });
});
