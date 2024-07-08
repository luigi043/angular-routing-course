import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private readonly router: Router){

  }
  ngOnInit(): void{
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationStart){
        console.log('Navigation Start')
      }
    })   
  }
  onActivate(event: unknown){
    console.log('On activate', event);

  }
}
