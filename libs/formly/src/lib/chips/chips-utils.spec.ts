import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ChipsUtils } from '@expense-tracker-ui/formly';

describe('ChipsUtils', () => {
  let utils: ChipsUtils;
  let formControl: FormControl;
  let itemControl: FormControl;
  let filters: any[];

  beforeEach(() => {
    formControl = new FormControl([]);
    itemControl = new FormControl();
    filters = [
      {
        label: 'chip1',
        value: 'chip1',
      },
      {
        label: 'chip2',
        value: 'chip2',
      },
    ];
    utils = new ChipsUtils(formControl, itemControl, filters);
  });

  it('should remove a chip', () => {
    formControl.setValue(['chip1', 'chip2']);

    utils.remove('chip1');

    expect(formControl.value).not.toContain('chip1');
  });

  it(
    'should not remove a chip when it does not' +
      ' exist in the form control value',
    () => {
      formControl.setValue(['chip' + '1', 'chip2']);
      utils.remove('chip3');
      expect(formControl.value).toEqual(['chip1', 'chip2']);
    },
  );

  it('should add a chip when it is selected from the autocomplete list', () => {
    const event = {
      option: { value: 'chip1' },
    } as MatAutocompleteSelectedEvent;

    utils.selected(event, { nativeElement: { value: '' } } as any);

    expect(formControl.value).toContain('chip1');
  });

  it('should add a chip when a valid value is entered', () => {
    const event = {
      value: 'chip1',
      chipInput: { clear: () => {} },
    } as MatChipInputEvent;

    utils.add(event);

    expect(formControl.value).toContain('chip1');
  });

  it('should not add a chip when an invalid value is entered', () => {
    const event = {
      value: 'chip3',
      chipInput: { clear: () => {} },
    } as MatChipInputEvent;

    utils.add(event);

    expect(formControl.value).not.toContain('chip3');
  });

  it('should filter labels to exclude already selected ones', () => {
    formControl.setValue(['chip1']);

    const labels = utils.filterLabels();

    expect(labels).not.toContain('chip1');
    expect(labels).toContain('chip2');
  });
});
