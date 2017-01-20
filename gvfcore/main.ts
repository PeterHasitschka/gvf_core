/**
 * Bootstrapping and loading application
 */

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {GvfCoreModule} from './gvfcore.module';
import {enableProdMode} from '@angular/core';

//enableProdMode();
platformBrowserDynamic().bootstrapModule(GvfCoreModule);