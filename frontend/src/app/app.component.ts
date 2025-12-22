import { Component } from '@angular/core';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { CartStatusComponent } from "./components/cart-status/cart-status.component";
import { LoginStatusComponent } from './components/login-status/login-status.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule, 
    ProductCategoryMenuComponent, 
    SearchComponent, 
    CartStatusComponent,
    LoginStatusComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
