import { FlatTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';

interface ParentNode {
  name: string;
  route: string;
  icon: string;
  children?: ParentNode[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  route: string;
  icon: string;
  level: number;
}

const TREE_DATA: ParentNode[] = [
  {name: 'Utilisateur',
    route: 'user',
    icon: 'fi fi-sr-users',
    children: [
      {
        name: 'Profil',
        route: 'user/profile',
        icon: 'fi fi-ss-bullet',
      }, 
      {
        name: 'Liste',
        route: 'user/list',
        icon: 'fi fi-ss-bullet',
      }, 
      {
        name: 'Créer',
        route: 'user/new',
        icon: 'fi fi-ss-bullet',
      }],
  },
  {name: 'Role',
    route: 'role',
    icon: 'fi fi-rr-user-gear',
    children: [{
        name: 'Liste',
        route: 'role/list',
        icon: 'fi fi-ss-bullet',
      }],
  },
  {name: 'Promotion',
    route: 'promotion',
    icon: 'fi fi-sr-ticket',
    children: [
      {
        name: 'Liste',
        route: 'promotion/list',
        icon: 'fi fi-ss-bullet',
      }, 
      {
        name: 'Créer',
        route: 'promotion/new',
        icon: 'fi fi-ss-bullet',
      }],
  },
  {name: 'Boutique',
    route: 'shop',
    icon: 'fi fi-sr-shopping-cart',
    children: [
      {
        name: 'Liste',
        route: 'shop/list',
        icon: 'fi fi-ss-bullet',
      }, 
      {
        name: 'Créer',
        route: 'shop/new',
        icon: 'fi fi-ss-bullet',
      }],
  },
  {name: 'Service',
    route: 'service',
    icon: 'fi fi-sr-shipping-fast',
    children: [
      {
        name: 'Catégorie',
        route: 'category',
        icon: 'fi fi-sr-filters',
        children: [
          {
            name: 'Liste catégories',
            route: 'service/category/list',
            icon: 'fi fi-ss-bullet',
          },
          {
            name: 'Créer catégorie',
            route: 'service/category/new',
            icon: 'fi fi-ss-bullet',
          }
        ]
      }, 
      {
        name: 'Liste services',
        route: 'service/list',
        icon: 'fi fi-ss-bullet',
      }, 
      {
        name: 'Créer service',
        route: 'service/new',
        icon: 'fi fi-ss-bullet',
      }],
  },
  {name: 'Pays',
    route: 'country',
    icon: 'fi fi-sr-flag',
    children: [
      {
        name: 'Liste pays',
        route: 'country/list',
        icon:'fi fi-ss-bullet',
      },
      {
        name: 'Créer pays',
        route: 'country/new',
        icon:'fi fi-ss-bullet',
      },
      {name: 'Région',
      route: 'region',
      icon: 'fi fi-sr-location-arrow',
      children: [
        {
          name: 'Liste régions',
          route: 'country/region/list',
          icon: 'fi fi-ss-bullet',
        }, 
        {
          name: 'Créer région',
          route: 'country/region/new',
          icon: 'fi fi-ss-bullet',
        },
        {name: 'Ville',
          route: 'city',
          icon: 'fi fi-sr-location-arrow',
          children: [
            {
              name: 'Liste villes',
              route: 'country/region/city/list',
              icon: 'fi fi-ss-bullet',
            }, 
            {
              name: 'Créer région',
              route: 'country/region/city/new',
              icon: 'fi fi-ss-bullet',
            },
            {name: 'Quartier',
              route: 'neighborhood',
              icon: 'fi fi-sr-location-arrow',
              children:[
                {
                  name: 'Liste quartiers',
                  route: 'country/region/city/neighborhood/list',
                  icon: 'fi fi-ss-bullet',
                }, 
                {
                  name: 'Créer quartier',
                  route: 'country/region/city/neighborhood/new',
                  icon: 'fi fi-ss-bullet',
                },
              ]
            }
          ]
        }],
      },
    ]
  }
];

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  private _transformer = (node: ParentNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      route: node.route,
      icon: node.icon,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  navSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor() {
    this.navSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;
}
