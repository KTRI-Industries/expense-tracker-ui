import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { FileValueAccessorDirective } from './file-value-accessor.directive';

@Component({
  template: `
    <input type="file" [formControl]="fileControl" />
  `,
  imports: [ReactiveFormsModule, FileValueAccessorDirective],
})
class TestHostComponent {
  fileControl = new FormControl();
}

describe('FileValueAccessorDirective', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let directive: FileValueAccessorDirective;
  let fileInput: HTMLInputElement;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TestHostComponent, FileValueAccessorDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;

    debugElement = fixture.debugElement.query(By.directive(FileValueAccessorDirective));
    directive = debugElement.injector.get(FileValueAccessorDirective);
    fileInput = debugElement.nativeElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(directive).toBeTruthy();
  });

  it('should be applied to file input elements', () => {
    expect(fileInput.type).toBe('file');
    expect(debugElement).toBeTruthy();
  });

  describe('ControlValueAccessor implementation', () => {
    it('should implement writeValue method', () => {
      // Act & Assert
      expect(() => directive.writeValue('test')).not.toThrow();
      expect(() => directive.writeValue(null)).not.toThrow();
      expect(() => directive.writeValue(undefined)).not.toThrow();
    });

    it('should register onChange callback', () => {
      // Arrange
      const mockOnChange = jest.fn();

      // Act
      directive.registerOnChange(mockOnChange);

      // Assert
      expect(directive.onChange).toBe(mockOnChange);
    });

    it('should register onTouched callback', () => {
      // Arrange
      const mockOnTouched = jest.fn();

      // Act
      directive.registerOnTouched(mockOnTouched);

      // Assert
      expect(directive.onTouched).toBe(mockOnTouched);
    });

    it('should call onChange when file input changes', () => {
      // Arrange
      const mockOnChange = jest.fn();
      directive.registerOnChange(mockOnChange);

      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const mockFileList = [mockFile] as unknown as FileList;

      // Act
      directive.onChange(mockFileList);

      // Assert
      expect(mockOnChange).toHaveBeenCalledWith(mockFileList);
    });

    it('should call onTouched when registered', () => {
      // Arrange
      const mockOnTouched = jest.fn();
      directive.registerOnTouched(mockOnTouched);

      // Act
      directive.onTouched();

      // Assert
      expect(mockOnTouched).toHaveBeenCalled();
    });
  });

  describe('host listener integration', () => {
    it('should trigger onChange when file input change event occurs', () => {
      // Arrange
      const mockOnChange = jest.fn();
      directive.registerOnChange(mockOnChange);

      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });

      // Mock the FileList
      Object.defineProperty(fileInput, 'files', {
        value: [mockFile],
        writable: false,
      });

      // Act
      fileInput.dispatchEvent(new Event('change'));

      // Assert
      expect(mockOnChange).toHaveBeenCalledWith([mockFile]);
    });

    it('should handle change event with empty file list', () => {
      // Arrange
      const mockOnChange = jest.fn();
      directive.registerOnChange(mockOnChange);

      // Mock empty FileList
      Object.defineProperty(fileInput, 'files', {
        value: [],
        writable: false,
      });

      // Act
      fileInput.dispatchEvent(new Event('change'));

      // Assert
      expect(mockOnChange).toHaveBeenCalledWith([]);
    });

    it('should handle change event with null files', () => {
      // Arrange
      const mockOnChange = jest.fn();
      directive.registerOnChange(mockOnChange);

      // Mock null FileList
      Object.defineProperty(fileInput, 'files', {
        value: null,
        writable: false,
      });

      // Act
      fileInput.dispatchEvent(new Event('change'));

      // Assert
      expect(mockOnChange).toHaveBeenCalledWith(null);
    });
  });

  describe('form integration', () => {
    it('should integrate with reactive forms', () => {
      // Arrange
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });

      // Mock FileList on the input
      Object.defineProperty(fileInput, 'files', {
        value: [mockFile],
        writable: false,
      });

      // Act
      fileInput.dispatchEvent(new Event('change'));

      // Assert
      expect(component.fileControl.value).toEqual([mockFile]);
    });

    it('should handle form control value changes', () => {
      // Act & Assert - verify the integration doesn't throw errors
      expect(() => fileInput.dispatchEvent(new Event('change'))).not.toThrow();
    });
  });
});
