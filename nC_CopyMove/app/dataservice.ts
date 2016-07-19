import {Injectable} from 'angular2/core';
import {SiteCollection} from './sitecollection';
import {DocumentLibrary} from './documentlibrary';
import {Directory} from './directory';

@Injectable()
export class DataService {


    private appWebUrl;

    constructor() {
        this.appWebUrl = _spPageContextInfo.webAbsoluteUrl;

    }

    searchSiteCollection() {
       
        let that = this;


        return new Promise(function (resolve, reject) {

            $.getScript(that.appWebUrl + "/_layouts/15/SP.RequestExecutor.js").done(function (script, textStatus) {

                var executor = new SP.RequestExecutor(that.appWebUrl);
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

                                sitecollection.push(
                                    new SiteCollection(that.searchJSONForValue(siteResult[x].Cells.results, "Title"), that.searchJSONForValue(siteResult[x].Cells.results, "Path")));
                            }

                            resolve(sitecollection);
                        },
                        error: function (data) {
                            var sitecollection = [];
                            reject(sitecollection);
                        }

                    }
                )
            });
        });
    }

    searchDocumentLibrary(pathURL,parent) {
        
        let that = this;

 

            var executor = new SP.RequestExecutor(this.appWebUrl);

            return new Promise(function (resolve, reject) {



                executor.executeAsync(
                    {
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

                                documentlibraries.push(new DocumentLibrary(that.searchJSONForValue(dossierResult[x].Cells.results, "Title"), that.searchJSONForValue(dossierResult[x].Cells.results, "Path"), parent));
                            }

                            resolve(documentlibraries);
                        },
                        error: function (data) {
                            var documentlibraries = [];
                            reject(documentlibraries);
                        }

                    }
                )
            });
      
    }

    searchDocumentLibrary2(pathURL, parent) {
        //var executor = new SP.RequestExecutor(this.appWebUrl);
       
        let that = this;

        return new Promise(function (resolve, reject) {
            $.getScript(pathURL + "/_layouts/15/SP.RequestExecutor.js").done(function (script, textStatus) {

                var executor = new SP.RequestExecutor(that.appWebUrl);

                executor.executeAsync(
                    {
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
                                    documentlibraries.push(new DocumentLibrary(dossierResult[x].Title, dossierResult[x].EntityTypeName, parent));
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
            executor.executeAsync(
                {
                   
                    url: that.appWebUrl + "/_api/SP.AppContextSite(@target)/web/GetFolderByServerRelativeUrl('" + relPath +"')/Folders?@target='" + pathUrl + "'", 
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
                            directory.push(
                                new Directory(that.searchJSONWebApi(siteResult[x], "Name"),parent));
                        }

                        resolve(directory);
                    },
                    error: function (data) {
                        var directory = [];
                        reject(directory);
                    }

                }
            )
        });
    }


   private searchJSONForValue(input: any, key: string) {
       input = JSON.stringify(input);
       input = input.match("Key\":\"" + key + ".*?}").toString();
       input = input.match("(?=Value\":\").*?(?=\",)").toString().substring(8);
        return input.toString();

    }

   private searchJSONWebApi(input: any, key: string) {
       input = JSON.stringify(input);
       input = input.match("(?=\"" + key + "\":\").*?(?=\",)").toString().substring(key.length+4);
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
            }]
    }
}