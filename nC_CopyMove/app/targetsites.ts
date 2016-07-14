import {DocumentLibrary} from './documentlibrary';
import {Http} from 'angular2/http';
//import {Promise} from 'es6-promise';






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
    documentlibraries: Array<DocumentLibrary>

    constructor() {
        var bla;

        // this.webAppURL = "http://win-iprrvsfootq";
        // this.hostWebUrl = decodeURIComponent(this.getQueryStringParameter('SPHostUrl'));
        this.hostWebUrl = "http://win-iprrvsfootq/sites/dev";
        this.appWebUrl = _spPageContextInfo.webAbsoluteUrl;
        console.log("Host Web is: " + this.hostWebUrl + "\n AppWebUrl is: " + this.appWebUrl);
        //this.getDocLib();
        //this.getSiteCollections();
        // this.getDocumentLibraries();
        this.doJSOMStuff(this.hostWebUrl);
        this.searchDocumentLibrary(this.hostWebUrl).then(response => { bla = response; this.documentlibraries = bla; console.log(bla); }, response => { console.log("Failure " + response); });
    }



    searchDocumentLibrary(siteURL) {
        var executor = new SP.RequestExecutor(this.appWebUrl);
        let that = this;



        this.documentlibraries = [];

        return new Promise(function (resolve, reject) {
            executor.executeAsync(
                {
                    //url: this.appWebUrl + "/_api/SP.AppContextSite(@target)/web/title?@target='" + siteURL + "'", 
                    //Leere Bibliotheken werden ignoriert , beheben?
                    url: that.appWebUrl + "/_api/search/query?querytext='contentclass:sts_list_documentlibrary'&trimduplicates=false",

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
