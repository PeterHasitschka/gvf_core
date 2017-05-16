import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent}  from './components/app/app.component';
import {SideInfoComponent}  from './components/app/sideinfo/sideinfo.component';
import {GraphworkspaceComponent}  from './components/graphworkspace/graphworkspace.component';
import {PlaneComponent}  from './components/plane/plane.component';

import {HttpModule} from '@angular/http'
import {SideInfoContentElementInfoComponent} from "./components/app/sideinfo/contentmodels/elementinfo/elementinfo.component";
import {InterGraphConnectionDirective} from "./components/graphworkspace/intergraphconnections/intergraphconnection.directive";
import {SideInfoContentAppDevToolsComponent} from "./components/app/sideinfo/contentmodels/devcontrol/appdevtools.component";
import {EscapeHtmlPipe} from "./pipes/keep-html.pipe";
@NgModule({
    imports: [BrowserModule, HttpModule],
    declarations: [AppComponent, GraphworkspaceComponent, PlaneComponent, SideInfoComponent,
        SideInfoContentElementInfoComponent, SideInfoContentAppDevToolsComponent, InterGraphConnectionDirective, EscapeHtmlPipe],
    bootstrap: [AppComponent]
})
/**
 * App Module loaded in main.ts
 */
export class GvfCoreModule {
}