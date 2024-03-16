import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AmountInputComponent } from './amount-input.component';
import { FormlyModule } from '@ngx-formly/core';
import { MatInput } from '@angular/material/input';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { render, RenderResult, screen } from '@testing-library/angular';
import { userEvent } from '@testing-library/user-event';
import '@testing-library/jest-dom';

describe('AmountInputComponent', () => {
  let renderResult: RenderResult<AmountInputComponent>;
  async function setup() {
    return await render(AmountInputComponent, {
      imports: [
        ReactiveFormsModule,
        FormlyModule.forRoot(),
        MatInput,
        NgxMaskDirective,
      ],
      providers: [provideNgxMask()],
      componentProperties: {
        field: {
          props: { placeholder: 'Enter amount' },
          formControl: new FormControl('[]'),
        } as any,
      },
    });
  }

  it('should create', async () => {
    const { container } = await setup();
    expect(container).toBeTruthy();
  });

  it('should display placeholder', async () => {
    renderResult = await setup();

    let placeholderText = screen.getByPlaceholderText('Enter amount');

    expect(placeholderText).toBeInTheDocument();
  });

  it('should update formControl value when input changes', async () => {
    renderResult = await setup();
    const input = screen.getByPlaceholderText('Enter amount');
    await userEvent.type(input, '100');

    expect(renderResult.fixture.componentInstance.formControl.value).toEqual(
      100,
    );
  });

  it('should mask input to two decimal values', async () => {
    renderResult = await setup();
    const input = screen.getByPlaceholderText('Enter amount');
    await userEvent.type(input, '100,543');

    expect(renderResult.fixture.componentInstance.formControl.value).toEqual(
      100.54,
    );
  });
});
