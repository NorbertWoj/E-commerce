import { ProductCategory } from './product-category';

describe('ProductCategory', () => {
  it('should create an instance', () => {
    expect(new ProductCategory(1,"Book")).toBeTruthy();
  });
});
