import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { FileUploadComponent } from './file-upload.component';
import { FileValueAccessorDirective } from './file-value-accessor.directive';

describe('FileUploadComponent', () => {
  let component: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let mockFile: File;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormlyModule.forRoot(),
        FileUploadComponent,
        FileValueAccessorDirective,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;

    // Setup required properties for FieldType - use Object.defineProperty to set readonly properties
    const formControl = new FormControl();
    const field = {
      formControl: formControl,
      props: {}
    } as FormlyFieldConfig;

    Object.defineProperty(component, 'formControl', {
      value: formControl,
      writable: true
    });

    Object.defineProperty(component, 'field', {
      value: field,
      writable: true
    });

    mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onFileChange', () => {
    it('should set file on form control when file is selected', () => {
      // Arrange
      const mockInput = {
        files: [mockFile]
      } as unknown as HTMLInputElement;

      const event = {
        target: mockInput
      } as unknown as Event;

      const setValueSpy = jest.spyOn(component.formControl, 'setValue');

      // Act
      component.onFileChange(event);

      // Assert
      expect(setValueSpy).toHaveBeenCalledWith(mockFile);
    });

    it('should set null on form control when no file is selected', () => {
      // Arrange
      const mockInput = {
        files: null
      } as unknown as HTMLInputElement;

      const event = {
        target: mockInput
      } as unknown as Event;

      const setValueSpy = jest.spyOn(component.formControl, 'setValue');

      // Act
      component.onFileChange(event);

      // Assert
      expect(setValueSpy).toHaveBeenCalledWith(null);
    });

    it('should set null on form control when files array is empty', () => {
      // Arrange
      const mockInput = {
        files: []
      } as unknown as HTMLInputElement;

      const event = {
        target: mockInput
      } as unknown as Event;

      const setValueSpy = jest.spyOn(component.formControl, 'setValue');

      // Act
      component.onFileChange(event);

      // Assert
      expect(setValueSpy).toHaveBeenCalledWith(null);
    });

    it('should handle multiple files by selecting only the first one', () => {
      // Arrange
      const secondFile = new File(['second content'], 'test2.txt', { type: 'text/plain' });
      const mockInput = {
        files: [mockFile, secondFile]
      } as unknown as HTMLInputElement;

      const event = {
        target: mockInput
      } as unknown as Event;

      const setValueSpy = jest.spyOn(component.formControl, 'setValue');

      // Act
      component.onFileChange(event);

      // Assert
      expect(setValueSpy).toHaveBeenCalledTimes(1);
      expect(setValueSpy).toHaveBeenCalledWith(mockFile);
    });
  });

  describe('template integration', () => {
    it('should render file input with correct attributes', () => {
      // Arrange
      const field = {
        formControl: component.formControl,
        props: {
          accept: '.txt,.pdf',
          multiple: false
        }
      } as FormlyFieldConfig;

      Object.defineProperty(component, 'field', {
        value: field,
        writable: true
      });

      fixture.detectChanges();

      // Act
      const fileInput = fixture.nativeElement.querySelector('input[type="file"]');

      // Assert
      expect(fileInput).toBeTruthy();
      expect(fileInput.getAttribute('type')).toBe('file');
    });

    it('should trigger onFileChange when file input changes', () => {
      // Arrange
      const onFileChangeSpy = jest.spyOn(component, 'onFileChange');
      const fileInput = fixture.nativeElement.querySelector('input[type="file"]');

      // Act
      fileInput.dispatchEvent(new Event('change'));

      // Assert
      expect(onFileChangeSpy).toHaveBeenCalled();
    });
  });
});
