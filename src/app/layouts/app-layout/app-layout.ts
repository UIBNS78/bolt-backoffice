import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideNav } from "./components/side-nav/side-nav";

@Component({
  selector: 'app-app-layout',
  imports: [
    RouterOutlet,
    SideNav
],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.css',
})
export class AppLayout {}
