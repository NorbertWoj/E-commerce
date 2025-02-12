import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchValue: string = '';

  constructor(private router: Router) {}

  doSearch() {
    const trimmedValue = this.searchValue?.trim();

    if (!trimmedValue) {
      return;
    }

    this.router.navigateByUrl(`/search/${encodeURIComponent(trimmedValue)}`);
  }
}