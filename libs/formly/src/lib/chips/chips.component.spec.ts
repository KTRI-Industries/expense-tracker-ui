import { ChipsComponent } from './chips.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ChipsComponent', () => {
  let component: ChipsComponent;
  let fixture: ComponentFixture<ChipsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [ChipsComponent, NoopAnimationsModule],
    });

    fixture = TestBed.createComponent(ChipsComponent);
    component = fixture.componentInstance;
    component.field = {
      formControl: new FormControl([]),
      props: { filters: { CHIP1: 'chip1', CHIP2: 'chip2' } },
    } as any;
    component.itemControl = new FormControl();
    component.filters = { CHIP1: 'chip1', CHIP2: 'chip2' };
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should remove a chip', () => {
    component.field.formControl.setValue(['chip1', 'chip2']);
    component.remove('chip1');
    expect(component.field.formControl.value).not.toContain('chip1');
  });

  it('should not remove a chip when it does not exist in the form control value', () => {
    component.field.formControl.setValue(['chip1', 'chip2']);
    component.remove('chip3');
    expect(component.field.formControl.value).toEqual(['chip1', 'chip2']);
  });

  it('should add a chip when it is selected from the autocomplete list', () => {
    const event = {
      option: { value: 'chip1' },
    } as MatAutocompleteSelectedEvent;

    component.selected(event);
    expect(component.field.formControl.value).toContain('chip1');
  });

  it('should add a chip when a valid value is entered', () => {
    const event = {
      value: 'CHIP1',
      chipInput: { clear: () => {} },
    } as MatChipInputEvent;

    component.add(event);
    expect(component.field.formControl.value).toContain('CHIP1');
  });

  it('should not add a chip when an invalid value is entered', () => {
    const event = {
      value: 'chip3',
      chipInput: { clear: () => {} },
    } as MatChipInputEvent;

    component.add(event);
    expect(component.field.formControl.value).not.toContain('chip3');
  });

  it('should filter labels to exclude already selected ones', () => {
    component.field.formControl.setValue(['chip1']);
    const labels = component.filterLabels();
    expect(labels).not.toContain('chip1');
    expect(labels).toContain('CHIP2');
  });
});
