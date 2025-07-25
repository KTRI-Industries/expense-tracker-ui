import { Category } from '@expense-tracker-ui/shared/api';
import {
  mapToFilters,
  mapToFiltersGeneric,
  EnumToLabelConverter,
  Chip
} from './utils';

// Mock labels for testing - using actual Category enum values
const mockCategoryLabels = {
  [Category.Salary]: 'Salary',
  [Category.Rent]: 'Rent',
  [Category.Groceries]: 'Groceries',
  [Category.Entertainment]: 'Entertainment',
  [Category.Bill]: 'Bills',
  [Category.Restaurant]: 'Restaurant',
};

describe('mapToFilters', () => {
  it('should map Category enum to filter objects with correct structure', () => {
    // Act
    const result = mapToFilters(Category, mockCategoryLabels);

    // Assert
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    // Check that each result has the correct structure
    result.forEach(item => {
      expect(item).toHaveProperty('value');
      expect(item).toHaveProperty('label');
      expect(Object.values(Category)).toContain(item.value);
    });

    // Check specific mappings
    const salaryFilter = result.find(item => item.value === Category.Salary);
    expect(salaryFilter).toEqual({ value: Category.Salary, label: 'Salary' });

    const rentFilter = result.find(item => item.value === Category.Rent);
    expect(rentFilter).toEqual({ value: Category.Rent, label: 'Rent' });
  });

  it('should handle empty enum', () => {
    // Arrange
    const emptyEnum = {};
    const emptyLabels = {};

    // Act
    const result = mapToFilters(emptyEnum as any, emptyLabels);

    // Assert
    expect(result).toEqual([]);
  });

  it('should handle enum with missing labels', () => {
    // Arrange
    const partialLabels = {
      [Category.Salary]: 'Salary',
      // Missing other labels
    };

    // Act
    const result = mapToFilters(Category, partialLabels);

    // Assert
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);

    const salaryFilter = result.find(item => item.value === Category.Salary);
    expect(salaryFilter).toEqual({ value: Category.Salary, label: 'Salary' });

    const rentFilter = result.find(item => item.value === Category.Rent);
    expect(rentFilter).toEqual({ value: Category.Rent, label: undefined });
  });
});

describe('mapToFiltersGeneric', () => {
  enum TestEnum {
    OPTION_A = 'OPTION_A',
    OPTION_B = 'OPTION_B',
    OPTION_C = 'OPTION_C',
  }

  const testEnumObject = {
    OPTION_A: 'OPTION_A' as const,
    OPTION_B: 'OPTION_B' as const,
    OPTION_C: 'OPTION_C' as const,
  };

  const testLabels = {
    OPTION_A: 'Option A Label',
    OPTION_B: 'Option B Label',
    OPTION_C: 'Option C Label',
  } as const;

  it('should map generic enum to Chip array with correct structure', () => {
    // Act
    const result = mapToFiltersGeneric(testEnumObject, testLabels);

    // Assert
    expect(result).toHaveLength(3);
    expect(result).toEqual([
      { value: 'OPTION_A', label: 'Option A Label' },
      { value: 'OPTION_B', label: 'Option B Label' },
      { value: 'OPTION_C', label: 'Option C Label' },
    ]);
  });

  it('should return Chip objects that satisfy the Chip interface', () => {
    // Act
    const result: Chip<string>[] = mapToFiltersGeneric(testEnumObject, testLabels);

    // Assert
    result.forEach(chip => {
      expect(chip).toHaveProperty('value');
      expect(chip).toHaveProperty('label');
      expect(typeof chip.value).toBe('string');
      expect(typeof chip.label).toBe('string');
    });
  });

  it('should handle single item enum', () => {
    // Arrange
    const singleEnum = { SINGLE: 'SINGLE' as const };
    const singleLabels = { SINGLE: 'Single Label' } as const;

    // Act
    const result = mapToFiltersGeneric(singleEnum, singleLabels);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ value: 'SINGLE', label: 'Single Label' });
  });

  it('should handle empty enum', () => {
    // Arrange
    const emptyEnum = {};
    const emptyLabels = {} as Record<never, string>;

    // Act
    const result = mapToFiltersGeneric(emptyEnum, emptyLabels);

    // Assert
    expect(result).toEqual([]);
  });
});

describe('EnumToLabelConverter', () => {
  const testLabels = {
    OPTION_A: 'Option A Label',
    OPTION_B: 'Option B Label',
    OPTION_C: 'Option C Label',
  };

  let converter: EnumToLabelConverter<string>;

  beforeEach(() => {
    converter = new EnumToLabelConverter(testLabels);
  });

  describe('constructor', () => {
    it('should create instance with provided labels', () => {
      // Act & Assert
      expect(converter).toBeInstanceOf(EnumToLabelConverter);
      expect(converter).toBeTruthy();
    });
  });

  describe('getEnumFromLabel', () => {
    it('should return correct enum value for valid label', () => {
      // Act & Assert
      expect(converter.getEnumFromLabel('Option A Label')).toBe('OPTION_A');
      expect(converter.getEnumFromLabel('Option B Label')).toBe('OPTION_B');
      expect(converter.getEnumFromLabel('Option C Label')).toBe('OPTION_C');
    });

    it('should return undefined for non-existent label', () => {
      // Act
      const result = converter.getEnumFromLabel('Non-existent Label');

      // Assert
      expect(result).toBeUndefined();
    });

    it('should return undefined for undefined label', () => {
      // Act
      const result = converter.getEnumFromLabel(undefined);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should return undefined for empty string label', () => {
      // Act
      const result = converter.getEnumFromLabel('');

      // Assert
      expect(result).toBeUndefined();
    });

    it('should handle case-sensitive label matching', () => {
      // Act
      const result = converter.getEnumFromLabel('option a label'); // lowercase

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('getLabelFromEnum', () => {
    it('should return correct label for valid enum value', () => {
      // Act & Assert
      expect(converter.getLabelFromEnum('OPTION_A')).toBe('Option A Label');
      expect(converter.getLabelFromEnum('OPTION_B')).toBe('Option B Label');
      expect(converter.getLabelFromEnum('OPTION_C')).toBe('Option C Label');
    });

    it('should return empty string for undefined enum value', () => {
      // Act
      const result = converter.getLabelFromEnum(undefined);

      // Assert
      expect(result).toBe('');
    });

    it('should return undefined for non-existent enum value', () => {
      // Act
      const result = converter.getLabelFromEnum('NON_EXISTENT' as any);

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('integration with different data types', () => {
    it('should work with numeric enum keys', () => {
      // Arrange
      const numericLabels = {
        0: 'Zero',
        1: 'One',
        2: 'Two',
      };
      const numericConverter = new EnumToLabelConverter(numericLabels);

      // Act & Assert
      expect(numericConverter.getLabelFromEnum(0)).toBe('Zero');
      expect(numericConverter.getLabelFromEnum(1)).toBe('One');
      expect(numericConverter.getEnumFromLabel('Zero')).toBe('0');
      expect(numericConverter.getEnumFromLabel('One')).toBe('1');
    });

    it('should work with Category enum values', () => {
      // Arrange
      const categoryLabels = {
        [Category.Salary]: 'Salary Income',
        [Category.Rent]: 'Monthly Rent',
        [Category.Groceries]: 'Food & Groceries',
      };
      const categoryConverter = new EnumToLabelConverter(categoryLabels);

      // Act & Assert
      expect(categoryConverter.getLabelFromEnum(Category.Salary)).toBe('Salary Income');
      expect(categoryConverter.getLabelFromEnum(Category.Rent)).toBe('Monthly Rent');
      expect(categoryConverter.getEnumFromLabel('Salary Income')).toBe(Category.Salary);
      expect(categoryConverter.getEnumFromLabel('Monthly Rent')).toBe(Category.Rent);
    });
  });

  describe('edge cases', () => {
    it('should handle empty labels object', () => {
      // Arrange
      const emptyConverter = new EnumToLabelConverter({});

      // Act & Assert
      expect(emptyConverter.getLabelFromEnum('ANY' as any)).toBeUndefined();
      expect(emptyConverter.getEnumFromLabel('ANY')).toBeUndefined();
    });

    it('should handle labels with duplicate values', () => {
      // Arrange
      const duplicateLabels = {
        OPTION_A: 'Same Label',
        OPTION_B: 'Same Label',
        OPTION_C: 'Different Label',
      };
      const duplicateConverter = new EnumToLabelConverter(duplicateLabels);

      // Act
      const foundEnum = duplicateConverter.getEnumFromLabel('Same Label');

      // Assert - should return the first match
      expect(['OPTION_A', 'OPTION_B']).toContain(foundEnum);
    });

    it('should handle special characters in labels', () => {
      // Arrange
      const specialLabels = {
        SPECIAL: 'Label with "quotes" & symbols!',
        UNICODE: 'Label with unicode: 🎉 ñ ü',
        WHITESPACE: '  Label with spaces  ',
      };
      const specialConverter = new EnumToLabelConverter(specialLabels);

      // Act & Assert
      expect(specialConverter.getLabelFromEnum('SPECIAL')).toBe('Label with "quotes" & symbols!');
      expect(specialConverter.getLabelFromEnum('UNICODE')).toBe('Label with unicode: 🎉 ñ ü');
      expect(specialConverter.getLabelFromEnum('WHITESPACE')).toBe('  Label with spaces  ');

      expect(specialConverter.getEnumFromLabel('Label with "quotes" & symbols!')).toBe('SPECIAL');
      expect(specialConverter.getEnumFromLabel('Label with unicode: 🎉 ñ ü')).toBe('UNICODE');
      expect(specialConverter.getEnumFromLabel('  Label with spaces  ')).toBe('WHITESPACE');
    });
  });
});
