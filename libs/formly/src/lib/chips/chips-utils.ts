import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ElementRef } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';

export class ChipsUtils {
  constructor(
    private formControl: FormControl,
    private itemControl: FormControl,
    private filters: Record<any, string> | undefined,
  ) {}

  /**
   * Removes a chip from the form control value.
   * @param chip - The chip to remove.
   */
  remove(chip: string) {
    const index = this.formControl.value.indexOf(chip);

    if (index >= 0) {
      this.formControl.value.splice(index, 1);
      this.formControl.setValue(this.formControl.value);
    }
  }

  /**
   * Handles the selection of an option from the autocomplete dropdown.
   * Adds the selected option to the form control value.
   * @param $event - The MatAutocompleteSelectedEvent.
   */
  selected(
    $event: MatAutocompleteSelectedEvent,
    textFieldInput: ElementRef<HTMLInputElement>,
  ) {
    this.formControl.setValue([...this.formControl.value, $event.option.value]);
    textFieldInput.nativeElement.value = '';
    this.itemControl.setValue(null);
  }

  /**
   * Handles the addition of a new chip.
   * Checks if the value is in the autocomplete list before adding it to the form control value.
   * @param event - The MatChipInputEvent.
   */
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    // Check if the value is in the autocomplete list
    if (value && this.filterLabels().includes(value)) {
      this.formControl.setValue([...this.formControl.value, value]);
    }
    this.itemControl.setValue(null);
  }

  /**
   * Filters the labels to be displayed in the autocomplete dropdown.
   * Excludes labels that are already selected and labels that do not include the current input value.
   * @returns An array of filtered labels.
   */
  filterLabels(): string[] {
    return Object.keys(this.filters!)
      .filter((key) => !this.formControl?.value?.includes(this.filters![key]))
      .filter((key) =>
        this.filters![key].includes(this.itemControl.value || ''),
      )
      .map((key) => this.filters![key]);
  }
}
