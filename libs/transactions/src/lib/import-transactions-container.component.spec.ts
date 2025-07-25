import { ImportTransactionsContainerComponent } from './import-transactions-container.component';
import {
  render,
  RenderResult,
} from '@testing-library/angular';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TransactionActions } from './+state/transactions.actions';
import '@testing-library/jest-dom';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import {
  AmountInputComponent,
  ChipsComponent,
  FileUploadComponent,
} from '@expense-tracker-ui/shared/formly';

describe('ImportTransactionsContainerComponent', () => {
  let renderResult: RenderResult<ImportTransactionsContainerComponent>;
  let mockStore: MockStore;

  beforeEach(async () => {
    renderResult = await setup();
    mockStore = renderResult.fixture.debugElement.injector.get(MockStore);
  });

  it('should create ImportTransactionsContainerComponent', () => {
    expect(renderResult.fixture.componentInstance).toBeTruthy();
  });

  it('should render the import transactions component', () => {
    const importComponent = renderResult.container.querySelector(
      'expense-tracker-ui-import-transactions'
    );
    expect(importComponent).toBeInTheDocument();
  });

  it('should dispatch importTransactions action when onImport is called', () => {
    const component = renderResult.fixture.componentInstance;
    const dispatchSpy = jest.spyOn(mockStore, 'dispatch');
    const mockFile = new File(['test content'], 'test.csv', { type: 'text/csv' });

    component.onImport(mockFile);

    expect(dispatchSpy).toHaveBeenCalledWith(
      TransactionActions.importTransactions({
        fileContent: mockFile,
      })
    );
  });

  it('should dispatch importTransactions action when import event is emitted from child component', async () => {
    const dispatchSpy = jest.spyOn(mockStore, 'dispatch');
    const mockFile = new File(['test content'], 'transactions.csv', { type: 'text/csv' });

    // Get the child component instance using the component reference
    const childComponent = renderResult.fixture.debugElement.query(
      (debugElement) => debugElement.componentInstance instanceof Object &&
                       debugElement.componentInstance.constructor.name === 'ImportTransactionsComponent'
    );

    if (childComponent && childComponent.componentInstance) {
      const childComponentInstance = childComponent.componentInstance;

      // Set up the form model with a file (simulating user file selection)
      childComponentInstance.model = { file: mockFile };
      childComponentInstance.form.patchValue({ file: mockFile });

      // Trigger change detection to ensure the form is updated
      renderResult.fixture.detectChanges();

      // Call the onImport method directly (simulating button click)
      childComponentInstance.onImport();
    }

    expect(dispatchSpy).toHaveBeenCalledWith(
      TransactionActions.importTransactions({
        fileContent: mockFile,
      })
    );
  });

  it('should handle different file types when onImport is called', () => {
    const component = renderResult.fixture.componentInstance;
    const dispatchSpy = jest.spyOn(mockStore, 'dispatch');
    const mockExcelFile = new File(['excel content'], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    component.onImport(mockExcelFile);

    expect(dispatchSpy).toHaveBeenCalledWith(
      TransactionActions.importTransactions({
        fileContent: mockExcelFile,
      })
    );
  });




});

async function setup() {
  return await render(ImportTransactionsContainerComponent, {
    providers: [
      provideMockStore({
        initialState: {},
      }),
    ],
    imports: [
      FormlyModule.forRoot({
        types: [
          {
            name: 'chips',
            component: ChipsComponent,
            defaultOptions: {
              defaultValue: [],
            },
            wrappers: ['form-field'],
          },
          {
            name: 'amount-input',
            component: AmountInputComponent,
            wrappers: ['form-field'],
          },
          {
            name: 'file',
            component: FileUploadComponent,
            wrappers: ['form-field'],
          },
        ],
        validationMessages: [
          { name: 'required', message: 'This field is required' },
        ],
      }),
      FormlyMaterialModule,
    ],
  });
}
