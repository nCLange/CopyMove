System.register(['./documentlibrary', './sitecollection', 'angular2/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var documentlibrary_1, sitecollection_1, core_1;
    var TargetSites;
    return {
        setters:[
            function (documentlibrary_1_1) {
                documentlibrary_1 = documentlibrary_1_1;
            },
            function (sitecollection_1_1) {
                sitecollection_1 = sitecollection_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            let TargetSites = class TargetSites {
                constructor() {
                    var tempresponse;
                    // this.webAppURL = "http://win-iprrvsfootq";
                    // this.hostWebUrl = decodeURIComponent(this.getQueryStringParameter('SPHostUrl'));
                    this.hostWebUrl = "http://win-iprrvsfootq/sites/dev";
                    this.appWebUrl = _spPageContextInfo.webAbsoluteUrl;
                    console.log("Host Web is: " + this.hostWebUrl + "\n AppWebUrl is: " + this.appWebUrl);
                    //this.getDocLib();
                    // this.getDocumentLibraries();
                    this.doJSOMStuff(this.hostWebUrl);
                    this.searchDocumentLibrary(this.hostWebUrl).then(response => { tempresponse = response; this.documentlibraries = tempresponse; console.log(tempresponse); }, response => { console.log("Failure " + response); });
                    this.searchSiteCollection(this.hostWebUrl).then(response => { tempresponse = response; this.siteCollection = tempresponse; console.log(tempresponse); }, response => { console.log("Failure " + response); });
                }
                clickedSC(i) {
                    var tempresponse;
                    console.log(this.siteCollection[i]);
                    this.siteCollection[i].toggle();
                    this.searchDocumentLibrary(this.hostWebUrl).then(response => { tempresponse = response; this.documentlibraries = tempresponse; console.log(tempresponse); }, response => { console.log("Failure " + response); });
                }
                searchSiteCollection(siteURL) {
                    var executor = new SP.RequestExecutor(this.appWebUrl);
                    let that = this;
                    this.siteCollection = [];
                    return new Promise(function (resolve, reject) {
                        executor.executeAsync({
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
                                    sitecollection.push(new sitecollection_1.SiteCollection(that.searchJSONForValue(siteResult[x].Cells.results, "Title"), that.searchJSONForValue(siteResult[x].Cells.results, "Path")));
                                }
                                resolve(sitecollection);
                            },
                            error: function (data) {
                                console.log(JSON.stringify(data));
                                var sitecollection = [];
                                reject(sitecollection);
                            }
                        });
                    });
                }
                searchDocumentLibrary(siteURL) {
                    var executor = new SP.RequestExecutor(this.appWebUrl);
                    let that = this;
                    this.documentlibraries = [];
                    return new Promise(function (resolve, reject) {
                        executor.executeAsync({
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
                                    documentlibraries.push(new documentlibrary_1.DocumentLibrary(that.searchJSONForValue(dossierResult[x].Cells.results, "Title"), that.searchJSONForValue(dossierResult[x].Cells.results, "Path")));
                                }
                                resolve(documentlibraries);
                            },
                            error: function (data) {
                                console.log(JSON.stringify(data));
                                var documentlibraries = [];
                                reject(documentlibraries);
                            }
                        });
                    });
                }
                searchJSONForValue(input, key) {
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
            };
            __decorate([
                core_1.Input(), 
                __metadata('design:type', Array)
            ], TargetSites.prototype, "siteCollection", void 0);
            TargetSites = __decorate([
                core_1.Component({
                    selector: "sitecol",
                    template: '<ul><li *ngFor="let site of siteCollection; let i = index" (click)="clickedSC(i)"selection-model>{{site.name}}  <div *ngIf="site.expanded"><ul><li *ngFor="let doclib of documentlibraries" selection-model>{{doclib.name}}</li></ul></div></li></ul>'
                }), 
                __metadata('design:paramtypes', [])
            ], TargetSites);
            exports_1("TargetSites", TargetSites);
        }
    }
});
//# sourceMappingURL=targetsites.js.map