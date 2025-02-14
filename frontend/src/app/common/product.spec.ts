import { Product } from './product';

describe('Product', () => {
  it('should create an instance', () => {
    expect(new Product(
      2,                // id
      '12345',            // sku
      'Sample Product',    // name
      'A description',     // description
      100,                 // unitPrice
      'image-url.jpg',     // imageUrl
      true,                // active
      50,                  // unitsInStock
      new Date(),          // dateCreated
      new Date()           // lastUpdated
    )).toBeTruthy();
  });
});
