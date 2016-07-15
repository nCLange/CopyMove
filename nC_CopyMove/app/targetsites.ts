import {DocumentLibrary} from './documentlibrary';
import {SiteCollection} from './sitecollection';
import {Http, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import { Input, Component} from 'angular2/core';

@Component({
    selector: "sitecol",
    template: '<ul><li *ngFor="let site of siteCollection; let i = index" (click)="clickedSC(i)"selection-model>{{site.name}}  <div *ngIf="site.expanded"><ul><li *ngFor="let doclib of documentlibraries" selection-model>{{doclib.name}}</li></ul></div></li></ul>'
})


export class TargetSites {

    ListID;
    URL;
    ItemID;
    siteURL;
    webAppURL;
    hostWebUrl;
    appWebUrl;
    queryText;
    oWebSite;
    documentlibraries: Array<DocumentLibrary>;
   @Input() siteCollection: Array<SiteCollection>;
    
   clickedSC(i) {
       var tempresponse;
       console.log(this.siteCollection[i]);
       this.siteCollection[i].toggle();
       this.searchDocumentLibrary(this.hostWebUrl).then(response => { tempresponse = response; this.documentlibraries = tempresponse; console.log(tempresponse); }, response => { console.log("Failure " + response); });

   }

    constructor() {
        var tempresponse;

         this.webAppURL = "http://win-iprrvsfootq";
        // this.hostWebUrl = decodeURIComponent(this.getQueryStringParameter('SPHostUrl'));
        this.hostWebUrl = "http://win-iprrvsfootq/sites/dev";
        this.appWebUrl = _spPageContextInfo.webAbsoluteUrl;
        console.log("Host Web is: " + this.hostWebUrl + "\n AppWebUrl is: " + this.appWebUrl);
        //this.getDocLib();
        // this.getDocumentLibraries();
        this.doJSOMStuff(this.hostWebUrl);
     //   this.searchDocumentLibrary(this.hostWebUrl).then(response => { tempresponse = response; this.documentlibraries = tempresponse; console.log(tempresponse); }, response => { console.log("Failure " + response); });
        this.searchSiteCollection(this.hostWebUrl).then(response => { tempresponse = response; this.siteCollection = tempresponse; console.log(tempresponse); }, response => { console.log("Failure " + response); });
    }

 

    searchSiteCollection(siteURL) {
        var executor = new SP.RequestExecutor(this.appWebUrl);
        let that = this;

        this.siteCollection = [];

        return new Promise(function (resolve, reject) {
            executor.executeAsync(
                {
                    //url: this.appWebUrl + "/_api/SP.AppContextSite(@target)/web/title?@target='" + siteURL + "'", 
                    //Leere Bibliotheken werden ignoriert , beheben?
                    url: that.appWebUrl + "/_api/search/query?querytext='contentclass:sts_site'&trimduplicates=false",

                    method: "GET",
                    headers: { "Accept": "application/json; odata=verbose" },
                    success: function (data) {
                        var myoutput = JSON.parse((data.body.toString()));
                        var sitecollection = [];
                        var siteResult = myoutput.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results;
                        console.log(siteResult);
                        for (var x = 0; x < siteResult.length; x++) {

                            sitecollection.push(new SiteCollection(that.searchJSONForValue(siteResult[x].Cells.results, "Title"), that.searchJSONForValue(siteResult[x].Cells.results, "Path")));
                        }

                        resolve(sitecollection);
                    },
                    error: function (data) {
                        console.log(JSON.stringify(data));
                        var sitecollection = [];
                        reject(sitecollection);
                    }

                }
            )
        });
    }

    searchDocumentLibrary(siteURL, pathURL = this.webAppURL) {
        var executor = new SP.RequestExecutor(this.appWebUrl);
        let that = this;



        this.documentlibraries = [];

        return new Promise(function (resolve, reject) {
            executor.executeAsync(
                {
                    //url: this.appWebUrl + "/_api/SP.AppContextSite(@target)/web/title?@target='" + siteURL + "'", 
                    //Leere Bibliotheken werden ignoriert , beheben?
                    url: that.appWebUrl + "/_api/search/query?querytext='contentclass:sts_list_documentlibrary+path:"+pathURL+"'&trimduplicates=false",

                    method: "GET",
                    headers: { "Accept": "application/json; odata=verbose" },
                    success: function (data) {
                        var myoutput = JSON.parse((data.body.toString()));
                        var documentlibraries = [];
                        var dossierResult = myoutput.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results;
                        console.log(dossierResult);
                        for (var x = 0; x < dossierResult.length; x++) {

                            documentlibraries.push(new DocumentLibrary(that.searchJSONForValue(dossierResult[x].Cells.results, "Title"), that.searchJSONForValue(dossierResult[x].Cells.results, "Path")));
                        }

                        resolve(documentlibraries);
                    },
                    error: function (data) {
                        console.log(JSON.stringify(data));
                        var documentlibraries = [];
                        reject(documentlibraries);
                    }

                }
            )
        });
    }

    searchJSONForValue(input: any, key: string) {
        input = JSON.stringify(input);
        input = input.match("Key\":\"" + key + ".*?}").toString();
        input = input.match("(?=Value\":\").*?(?=\",)").toString().substring(8);

        return input.toString();

    }


    doJSOMStuff(siteURL) {

        /*
 
         var clientContext = new SP.ClientContext(siteURL);
         this.oWebSite = clientContext.get_web();
         clientContext.load(this.oWebSite);
 
         clientContext.executeQueryAsync(this.onQuerySuceeded, this.onQueryFailed);
         */

        var clientContext = new SP.ClientContext(this.appWebUrl);
        var factory = new SP.ProxyWebRequestExecutorFactory(this.appWebUrl);
        clientContext.set_webRequestExecutorFactory(factory);
        var appContextSite = new SP.AppContextSite(clientContext, this.hostWebUrl);

        var web = appContextSite.get_web();
        clientContext.load(web);

        clientContext.executeQueryAsync(function (sender, args) { console.log("Title: " + web.get_title()); }, this.onQueryFailed);

    }

    onQueryFailed(sender, args) {
        console.log('Request failed ' + args.get_message() + '\n' + args.get_stackTrace());
    }

    onQuerySuceeded(sender, args) {
        console.log('Title' + this.oWebSite.get_title());
    }


}
