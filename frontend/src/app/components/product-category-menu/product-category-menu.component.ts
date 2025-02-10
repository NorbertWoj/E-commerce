import { Component } from '@angular/core';
import { ProductCategory } from '../../common/product-category';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-category-menu',
  standalone: true,
  imports: [],
  templateUrl: './product-category-menu.component.html',
  styleUrl: './product-category-menu.component.css'
})
export class ProductCategoryMenuComponent {
  productCategories: ProductCategory[] = [];

  constructor(private productService: ProductService) {

  }

  ngOnInit() {
    this.listProductCategories();
  }

  listProductCategories() {};
  
}
