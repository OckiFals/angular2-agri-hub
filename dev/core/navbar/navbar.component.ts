import { Component } from '@angular/core';

@Component({
    selector: 'nav-bar',
    template: `
        <nav class="navbar navbar-default navbar-static-top">
            <div class="container">
                <div class="navbar-header">
                    <a [routerLink]="['/']" class="navbar-brand">AgriHub</a>
                </div>
                <div id="navbar" class="navbar-collapse">
                    <ul class="nav navbar-nav">
                        <li class="active"><a href="/">Home</a></li>
                        <li><a>About</a></li>
                    </ul>
                    <ul class="nav navbar-nav navbar-right">
                        <li><a [routerLink]="['/logout']">{{ username }} (Logout)</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    `
})
export class NavbarComponent{
    username = 'basukicahya';
}