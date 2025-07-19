import { EnumToLabelPipe } from './enum-to-label.pipe';
import { Category } from '@expense-tracker-ui/shared/api';
import { categoryLabels } from '@expense-tracker-ui/constants';

describe('EnumToLabelPipe', () => {
  let pipe: EnumToLabelPipe;

  beforeEach(() => {
    pipe = new EnumToLabelPipe();
  });

  it('should return the correct label for a given Category enum value', () => {
    expect(pipe.transform(Category.Bill, categoryLabels)).toEqual('bills');
  });

  it('should return an empty string if the Category enum value is not in the map', () => {
    expect(pipe.transform('NonExistingCategory', categoryLabels)).toEqual(
      undefined,
    );
  });
});
