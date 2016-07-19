System.register(['angular2/core', './sitecollection', './documentlibrary', './directory'], function(exports_1, context_1) {
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
    var core_1, sitecollection_1, documentlibrary_1, directory_1;
    var DataService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (sitecollection_1_1) {
                sitecollection_1 = sitecollection_1_1;
            },
            function (documentlibrary_1_1) {
                documentlibrary_1 = documentlibrary_1_1;
            },
            function (directory_1_1) {
                directory_1 = directory_1_1;
            }],
        execute: function() {
            let DataService = class DataService {
                constructor() {
                    this.appWebUrl = _spPageContextInfo.webAbsoluteUrl;
                }
                searchSiteCollection() {
                    let that = this;
                    return new Promise(function (resolve, reject) {
                        $.getScript(that.appWebUrl + "/_layouts/15/SP.RequestExecutor.js").done(function (script, textStatus) {
                            var executor = new SP.RequestExecutor(that.appWebUrl);
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
                                    var sitecollection = [];
                                    reject(sitecollection);
                                }
                            });
                        });
                    });
                }
                searchDocumentLibrary(pathURL, parent) {
                    let that = this;
                    var executor = new SP.RequestExecutor(this.appWebUrl);
                    return new Promise(function (resolve, reject) {
                        executor.executeAsync({
                            //url: this.appWebUrl + "/_api/SP.AppContextSite(@target)/web/title?@target='" + siteURL + "'", 
                            //Leere Bibliotheken werden ignoriert , beheben?
                            url: that.appWebUrl + "/_api/search/query?querytext='contentclass:sts_list_documentlibrary+path:" + pathURL + "'&trimduplicates=false",
                            method: "GET",
                            headers: { "Accept": "application/json; odata=verbose" },
                            success: function (data) {
                                var myoutput = JSON.parse((data.body.toString()));
                                var documentlibraries = [];
                                var dossierResult = myoutput.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results;
                                for (var x = 0; x < dossierResult.length; x++) {
                                    documentlibraries.push(new documentlibrary_1.DocumentLibrary(that.searchJSONForValue(dossierResult[x].Cells.results, "Title"), that.searchJSONForValue(dossierResult[x].Cells.results, "Path"), parent));
                                }
                                resolve(documentlibraries);
                            },
                            error: function (data) {
                                var documentlibraries = [];
                                reject(documentlibraries);
                            }
                        });
                    });
                }
                searchDocumentLibrary2(pathURL, parent) {
                    //var executor = new SP.RequestExecutor(this.appWebUrl);
                    let that = this;
                    return new Promise(function (resolve, reject) {
                        $.getScript(pathURL + "/_layouts/15/SP.RequestExecutor.js").done(function (script, textStatus) {
                            var executor = new SP.RequestExecutor(that.appWebUrl);
                            executor.executeAsync({
                                //url: this.appWebUrl + "/_api/SP.AppContextSite(@target)/web/title?@target='" + siteURL + "'", 
                                //Leere Bibliotheken werden ignoriert , beheben?
                                url: that.appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists?@target='" + pathURL + "'",
                                method: "GET",
                                headers: { "Accept": "application/json; odata=verbose" },
                                success: function (data) {
                                    var myoutput = JSON.parse((data.body.toString()));
                                    console.log(myoutput);
                                    var documentlibraries = [];
                                    var dossierResult = myoutput.d.results;
                                    for (var x = 0; x < dossierResult.length; x++) {
                                        if (dossierResult[x].DocumentTemplateUrl != null)
                                            //documentlibraries.push(new DocumentLibrary(that.searchJSONForValue(dossierResult[x].Cells.results, "Title"), that.searchJSONForValue(dossierResult[x].Cells.results, "Path"), parent));
                                            documentlibraries.push(new documentlibrary_1.DocumentLibrary(dossierResult[x].Title, dossierResult[x].EntityTypeName, parent));
                                    }
                                    resolve(documentlibraries);
                                },
                                error: function (data) {
                                    var documentlibraries = [];
                                    reject(documentlibraries);
                                }
                            });
                        });
                    });
                }
                searchDirectories(pathUrl, relPath, parent) {
                    var executor = new SP.RequestExecutor(this.appWebUrl);
                    //var executor = new SP.RequestExecutor(pathUrl);
                    let that = this;
                    console.log(pathUrl + "/_api/web/GetFolderByServerRelativeUrl('" + relPath + "')");
                    return new Promise(function (resolve, reject) {
                        executor.executeAsync({
                            url: that.appWebUrl + "/_api/SP.AppContextSite(@target)/web/GetFolderByServerRelativeUrl('" + relPath + "')/Folders?@target='" + pathUrl + "'",
                            //Leere Bibliotheken werden ignoriert , beheben?
                            //url: (pathUrl+"/_api/web/GetFolderByServerRelativeUrl('"+relPath+"')"),
                            method: "GET",
                            headers: { "Accept": "application/json; odata=verbose" },
                            success: function (data) {
                                var myoutput = JSON.parse((data.body.toString()));
                                var directory = [];
                                var siteResult = myoutput.d.results;
                                console.log(siteResult);
                                for (var x = 0; x < siteResult.length; x++) {
                                    console.log(siteResult[x]);
                                    directory.push(new directory_1.Directory(that.searchJSONWebApi(siteResult[x], "Name"), parent));
                                }
                                resolve(directory);
                            },
                            error: function (data) {
                                var directory = [];
                                reject(directory);
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
                searchJSONWebApi(input, key) {
                    input = JSON.stringify(input);
                    input = input.match("(?=\"" + key + "\":\").*?(?=\",)").toString().substring(key.length + 4);
                    return input.toString();
                }
                getData() {
                    return [{
                            "id": 1,
                            "name": "Pizza Vegetaria",
                            "price": 5.99
                        }, {
                            "id": 2,
                            "name": "Pizza Salami",
                            "price": 10.99
                        }, {
                            "id": 3,
                            "name": "Pizza Thunfisch",
                            "price": 7.99
                        }, {
                            "id": 4,
                            "name": "Aktueller Flyer",
                            "price": 0
                        }];
                }
            };
            DataService = __decorate([
                core_1.Injectable(), 
                __metadata('design:paramtypes', [])
            ], DataService);
            exports_1("DataService", DataService);
        }
    }
});
//# sourceMappingURL=dataservice.js.map