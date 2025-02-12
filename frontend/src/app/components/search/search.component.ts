import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  constructor(private router: Router) {}

  doSearch(value: string){
    console.log(`value=${value}`);

    // used the function encodeURIComponent to escape special characters for http requests
    this.router.navigateByUrl(`/search/${encodeURIComponent(value)}`);
  }
}
