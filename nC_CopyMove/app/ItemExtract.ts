import {Component} from "angular2/core";
import {RouteParams} from "angular2/router";

@Component({
    selector: 'curlist',
    template: `<ul><li>List ID: {{ListID}}</li><li>url:{{URL}}</li></ul>`

})


export class ItemExtract {

    ListID;
    URL;
    ItemID;

    constructor() {
        this.URL = window.location.href;
        this.ListID = this.URL.substring(this.URL.indexOf("{") + 1, this.URL.lastIndexOf("}"));
       
    }

}
