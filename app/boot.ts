

import {bootstrap} from '@angular/platform-browser-dynamic';
import {provide, enableProdMode} from '@angular/core';
//import {HTTP_PROVIDERS} from 'angular2/http';
import {AppComponent} from './app.component';


enableProdMode();

bootstrap(AppComponent/*, [HTTP_PROVIDERS]*/);

