import { OrderItem } from './order-item';
import { CartItem } from './cart-item';
import { Product } from './product';

describe('OrderItem', () => {
  it('should create an instance', () => {
    const mockProduct: Product = {
      id: 1,
      sku: 'PROD-001',
      name: 'Test Product',
      description: 'Test Description',
      imageUrl: 'assets/images/test.jpg',
      active: true,
      unitsInStock: 100,
      unitPrice: 19.99,
      dateCreated: new Date(),
      lastUpdated: new Date()
    };

    const mockCartItem = new CartItem(mockProduct);

    expect(new OrderItem(mockCartItem)).toBeTruthy();
  });
});