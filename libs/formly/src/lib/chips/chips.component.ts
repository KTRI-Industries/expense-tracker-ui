import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import {
  MatChip,
  MatChipGrid,
  MatChipInput,
  MatChipInputEvent,
  MatChipRemove,
  MatChipRow,
} from '@angular/material/chips';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { ChipsUtils } from './chips-utils';

/**
 * ChipsComponent is a custom Formly field that allows the user to select multiple options from a dropdown list.
 * The selected options are displayed as chips that can be removed (good for "tagging"). The values are saved in internal FormControl.
 */
@Component({
  selector: 'expense-tracker-ui-formly',
  standalone: true,
  imports: [
    CommonModule,
    MatChip,
    MatFormField,
    MatLabel,
    MatChipGrid,
    MatChipRemove,
    MatChipRow,
    MatIcon,
    ReactiveFormsModule,
    MatChipInput,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
  ],
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.css',
})
export class ChipsComponent
  extends FieldType<FieldTypeConfig>
  implements OnInit
{
  @ViewChild('textFieldInput') textFieldInput!: ElementRef<HTMLInputElement>;

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  filters: Record<any, string> | undefined;

  private chipsUtils: ChipsUtils | undefined;

  /**
   * Strictly type the inherited FormControl.
   */
  override get formControl(): FormControl<string[]> {
    return super.formControl;
  }

  /**
   * This is the form control that keeps the autocomplete value
   */
  itemControl = new FormControl();

  /**
   * OnInit lifecycle hook. Initializes the filters property.
   */
  ngOnInit(): void {
    this.filters = this.field?.props?.['filters'];
    this.chipsUtils = new ChipsUtils(
      this.formControl,
      this.itemControl,
      this.filters,
    );
  }

  /**
   * Removes a chip from the form control value.
   * @param chip - The chip to remove.
   */
  remove(chip: string) {
    this.chipsUtils?.remove(chip);
  }

  /**
   * Handles the selection of an option from the autocomplete dropdown.
   * Adds the selected option to the form control value.
   * @param $event - The MatAutocompleteSelectedEvent.
   */
  selected($event: MatAutocompleteSelectedEvent) {
    this.chipsUtils?.selected($event, this.textFieldInput);
  }

  /**
   * Handles the addition of a new chip.
   * Checks if the value is in the autocomplete list before adding it to the form control value.
   * @param event - The MatChipInputEvent.
   */
  add(event: MatChipInputEvent): void {
    this.chipsUtils?.add(event);
  }

  /**
   * Filters the labels to be displayed in the autocomplete dropdown.
   * Excludes labels that are already selected and labels that do not include the current input value.
   * @returns An array of filtered labels.
   */
  filterLabels(): string[] {
    return this.chipsUtils?.filterLabels() || [];
  }
}
