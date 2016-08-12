import {bootstrap} from 'angular2/platform/browser';
import {provide, enableProdMode} from 'angular2/core';
import {HTTP_PROVIDERS} from 'angular2/http';
import {AppComponent} from './app.component';


bootstrap(AppComponent, [HTTP_PROVIDERS]);

