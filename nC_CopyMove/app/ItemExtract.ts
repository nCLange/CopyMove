import {Component} from "angular2/core";

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
        this.ListID = this.URL.substring(this.URL.indexOf("SPListId") + 10, this.URL.lastIndexOf("}"));
        this.ItemID = this.URL.substring(this.URL.indexOf("SPListItemId") + 13, this.URL.lastIndexOf("&"));
        this.ItemID = this.ItemID.split(",");

        console.log(this.ItemID.join());
        console.log(this.ListID);


    }

    getSelectedItems() {
        var context = SP.ClientContext.get_current();
        var list = context.get_web().get_lists().getById(this.ListID);
        var items = list.getItems

    }

}
