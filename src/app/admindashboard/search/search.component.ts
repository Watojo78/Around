import { Component, OnInit } from '@angular/core';
import { Route } from '../../models/route';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {

  routes!: Route[];
  categoryRoutes: any;
  filteredRoutes: any;
  children!: Route[] | undefined;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchRoutes();
    this.fetchCategoriesRoutes();
  }

  private fetchRoutes(){
    this.http.get<Route[]>('./assets/json/routes.json') // Adjust path if needed
      .subscribe(routes => {
        this.routes = routes;
        this.filteredRoutes = routes; // Store fetched routes
      })
  }

  private fetchCategoriesRoutes(){
    this.http.get<any[]>('./assets/json/category-route.json') // Adjust path if needed
      .subscribe(categories => {
        this.categoryRoutes = categories;
      })
  }

  applyFilter(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
  
    this.filteredRoutes = searchTerm ?
      this.routes.filter(route => {
        return (
          route.name.toLowerCase().includes(searchTerm) ||
          route.path.toLowerCase().includes(searchTerm)
        );
      }) :
      this.routes; // Reset to all routes if searchTerm is empty
  }

  getCatRoute(categoryId: number): string | undefined {
    return this.categoryRoutes?.find((category: { id: number; }) => category.id === categoryId)?.name;
  }

}
