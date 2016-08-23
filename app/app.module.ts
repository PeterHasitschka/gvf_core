import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './components/app/app.component';
import { GraphworkspaceComponent }  from './components/graphworkspace/graphworkspace.component';
import { PlaneComponent }  from './components/plane/plane.component';


@NgModule({
    imports: [BrowserModule],
    declarations: [AppComponent, GraphworkspaceComponent, PlaneComponent],
    bootstrap: [AppComponent]
})
/**
 * App Module loaded in main.ts
 */
export class AppModule { }