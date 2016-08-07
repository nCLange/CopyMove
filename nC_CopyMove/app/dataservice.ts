import {Injectable} from 'angular2/core';
import {SiteCollection} from './sitecollection';
import {DocumentLibrary} from './documentlibrary';
import {Directory} from './directory';
import {ItemDL, ContentType} from './itemdl';
import {CopyRoot} from './copyroot';
import {ListField} from './listFields';
import {FieldContent} from './fieldcontent';

@Injectable()
export class DataService {


    private appWebUrl;


    constructor() {
        this.appWebUrl = _spPageContextInfo.webAbsoluteUrl;

    }

    getListInfoFromId(caller: CopyRoot){
    var ctx = new SP.ClientContext(caller.srcUrl);
       // var appContextSite = new SP.AppContextSite(ctx, caller.parent.targetUrl).get_web();
        var srcList = ctx.get_web().get_lists().getById(caller.srcListId);
        var fieldcollection = srcList.get_fields();
        ctx.load(srcList);
        ctx.load(fieldcollection);

        return new Promise(function (resolve, reject) {
                ctx.executeQueryAsync(
                    function(){
                        caller.title =  srcList.get_title();
                        
                            for (var i = 0; i < fieldcollection.get_count(); i++) {
                                if(!fieldcollection.itemAt(i).get_fromBaseType() && !fieldcollection.itemAt(i).get_hidden()){
                                    var listField = new ListField(fieldcollection.itemAt(i).get_internalName(),fieldcollection.itemAt(i).get_typeAsString());
                                    if(listField.allowed) 
                                        caller.fields.push(listField);
                                }         
                            }
                        resolve();
                    },
                    function(){
                    reject(arguments[1].get_message());
                    });
        });
    }

    getFolderFromUrl(caller: CopyRoot) {

        var ctx = new SP.ClientContext(caller.targetUrl);
      //  var appContextSite = new SP.AppContextSite(ctx, caller.targetUrl);


        var currentFolder = ctx.get_web().getFolderByServerRelativeUrl(caller.targetTitle + "/" + caller.rootpath);
        
        ctx.load(currentFolder);
        return new Promise(function (resolve, reject) {
            ctx.executeQueryAsync(
                function () {
                    caller.rootFolder = currentFolder;
                    resolve();

                },
                function () {
                    reject(arguments[1].get_message());

                });
        });

    }

    searchSiteCollection(caller) {

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
                            //console.log(siteResult);
                            for (var x = 0; x < siteResult.length; x++) {

                                sitecollection.push(
                                    new SiteCollection(that.searchJSONForValue(siteResult[x].Cells.results, "Title"), that.searchJSONForValue(siteResult[x].Cells.results, "Path"),caller));
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

  /*  searchDocumentLibrary(pathURL, parent) {

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
    */
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
                        url: pathURL + "/_api/web/lists",
                        method: "GET",
                        headers: { "Accept": "application/json; odata=verbose" },
                        success: function (data) {
                            var myoutput = JSON.parse((data.body.toString()));
                            var documentlibraries = [];
                            var dossierResult = myoutput.d.results;
                            for (var x = 0; x < dossierResult.length; x++) {
                                if (dossierResult[x].DocumentTemplateUrl != null && dossierResult[x].Title != "App Packages" && dossierResult[x].Title != "Documents" && dossierResult[x].Title!= "Site Assets")
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

        return new Promise(function (resolve, reject) {
            executor.executeAsync(
                {

                    url: pathUrl + "/_api/web/GetFolderByServerRelativeUrl('" + relPath + "')/Folders?$expand=ListItemAllFields",
                    //Leere Bibliotheken werden ignoriert , beheben?
                    //url: (pathUrl+"/_api/web/GetFolderByServerRelativeUrl('"+relPath+"')"),

                    method: "GET",
                    headers: { "Accept": "application/json; odata=verbose" },
                    success: function (data) {
                        var myoutput = JSON.parse((data.body.toString()));
                        var directory = [];

                        var siteResult = myoutput.d.results;
                        for (var x = 0; x < siteResult.length; x++) {
                            if (siteResult[x].Name != "Forms" && !siteResult[x].ListItemAllFields.ContentTypeId.startsWith("0x0120D520") )
                                directory.push(
                                    new Directory(siteResult[x].Name, parent));
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
        input = input.match("(?=\"" + key + "\":\").*?(?=\",)").toString().substring(key.length + 4);
        return input.toString();

    }


    getElementById(pathUrl, listTitle, id, parent) {
        var executor = new SP.RequestExecutor(this.appWebUrl);
        let that = this;

        return new Promise(function (resolve, reject) {
            executor.executeAsync(
                {

                    url: pathUrl + "/_api/web/lists/GetByTitle('" + listTitle + "')/items(" + id + ")",
                    method: "GET",
                    headers: { "Accept": "application/json; odata=verbose" },
                    success: function (data) {
                        var myoutput = JSON.parse((data.body.toString()));
                        var itemdl = [];
                        var siteResult = myoutput.d;

                        for (var x = 0; x < siteResult.length; x++) {
                            itemdl.push(
                                new ItemDL(id, parent)
                            );
                        }

                        resolve(itemdl);
                    },
                    error: function (data) {
                        var directory = [];
                        reject(directory);
                    }

                }
            )
        });
    }

    buildSoapEnvelope(caller: ItemDL) {
        var line = "";
        line += "<?xml version= \"1.0\" encoding= \"utf-8\" ?>";
        line += "<soap12:Envelope xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:soap12=\"http://www.w3.org/2003/05/soap-envelope\">";
        line += "<soap12:Body>";
        line += "<CopyIntoItemsLocal xmlns=\"http://schemas.microsoft.com/sharepoint/soap/\">";
        line += "<SourceUrl>" + caller.parent.srcUrl + "/" + caller.parent.title + "/" + caller.folderURL + caller.name + "</SourceUrl>";
       // line += "<SourceUrl>http://win-iprrvsfootq/sites/dev/DocaDoca/testing.txt</SourceUrl>";
        line += "<DestinationUrls>";
     //   line += "<string>http://win-iprrvsfootq/sites/dev/DocumentTest1/testing.txt</string>";
        line += "<string>" + caller.parent.targetUrl + "/" + caller.parent.targetTitle + "/" + caller.folderURL + caller.name+ "</string>";
        line += "</DestinationUrls>";
        line += "</CopyIntoItemsLocal>";
        line += "</soap12:Body>";
        line += "</soap12:Envelope>";

        return line;

    }

    soapAjax(caller: ItemDL) {
        let that = this;
        var xmlstring = this.buildSoapEnvelope(caller);
        return new Promise(function (resolve, reject) {
            jQuery.ajax({
                url: caller.parent.srcUrl + "/_vti_bin/copy.asmx",
                type: "POST",
                dataType: "xml",
                data: xmlstring,
                success: function (xData, status) {
                    that.getListIDFromFile(caller).then(
                   response =>{ resolve()},
                   response => { reject(response);}
                    );
                },
                error: function(xData,status ){
                    reject(xData+" "+status);

                },
                contentType: "application/soap+xml; charset=utf-8"

            });
        });

    }

    getListIDFromFile(caller: ItemDL) {
      
       var ctx = new SP.ClientContext(caller.parent.targetUrl);
        //var appContextSite = new SP.AppContextSite(ctx, caller.parent.targetUrl);
       
        var file = ctx.get_web().getFileByServerRelativeUrl("/"+caller.parent.targetUrl.replace(/^(?:\/\/|[^\/]+)*\//, "")+"/"+caller.parent.targetTitle + "/" + caller.folderURL + caller.name);
        console.log(file);
        console.log("/"+caller.parent.targetUrl.replace(/^(?:\/\/|[^\/]+)*\//, "")+"/"+caller.parent.targetTitle + "/" + caller.folderURL + caller.name);

        ctx.load(file, 'ListItemAllFields');
        ctx.load(file);

        return new Promise(function (resolve, reject) {
            ctx.executeQueryAsync(
                function () {
                    caller.targetId = file.get_listItemAllFields().get_id();
                    resolve()
                },
                function () {
                   reject(arguments[1].get_message());
                });
        });

    }
/*
    downloadFile(caller: ItemDL) {

        let that = this;

        $.getScript(caller.parent.srcUrl + "/_layouts/15/SP.RequestExecutor.js", function () {
            (SP as any).RequestExecutorInternalSharedUtility.BinaryDecode = function SP_RequestExecutorInternalSharedUtility$BinaryDecode(data) {
                var ret = '';

                if (data) {
                    var byteArray = new Uint8Array(data);

                    for (var i = 0; i < data.byteLength; i++) {
                        ret = ret + String.fromCharCode(byteArray[i]);
                    }
                }
                ;
                return ret;
            };

            (SP as any).RequestExecutorUtility.IsDefined = function SP_RequestExecutorUtility$$1(data) {
                var nullValue = null;

                return data === nullValue || typeof data === 'undefined' || !data.length;
            };

            (SP as any).RequestExecutor.ParseHeaders = function SP_RequestExecutor$ParseHeaders(headers) {
                if ((SP as any).RequestExecutorUtility.IsDefined(headers)) {
                    return null;
                }
                var result = {};
                var reSplit = new RegExp('\r?\n');
                var headerArray = headers.split(reSplit);

                for (var i = 0; i < headerArray.length; i++) {
                    var currentHeader = headerArray[i];

                    if (!(SP as any).RequestExecutorUtility.IsDefined(currentHeader)) {
                        var splitPos = currentHeader.indexOf(':');

                        if (splitPos > 0) {
                            var key = currentHeader.substr(0, splitPos);
                            var value = currentHeader.substr(splitPos + 1);

                            key = (SP as any).RequestExecutorNative.trim(key);
                            value = (SP as any).RequestExecutorNative.trim(value);
                            result[key.toUpperCase()] = value;
                        }
                    }
                }
                return result;
            };

            (SP as any).RequestExecutor.internalProcessXMLHttpRequestOnreadystatechange = function SP_RequestExecutor$internalProcessXMLHttpRequestOnreadystatechange(xhr, requestInfo, timeoutId) {
                if (xhr.readyState === 4) {
                    if (timeoutId) {
                        window.clearTimeout(timeoutId);
                    }
                    xhr.onreadystatechange = (SP as any).RequestExecutorNative.emptyCallback;
                    var responseInfo = new (SP as any).ResponseInfo();

                    responseInfo.state = requestInfo.state;
                    responseInfo.responseAvailable = true;
                    if (requestInfo.binaryStringResponseBody) {
                        responseInfo.body = (SP as any).RequestExecutorInternalSharedUtility.BinaryDecode(xhr.response);
                    }
                    else {
                        responseInfo.body = xhr.responseText;
                    }
                    responseInfo.statusCode = xhr.status;
                    responseInfo.statusText = xhr.statusText;
                    responseInfo.contentType = xhr.getResponseHeader('content-type');
                    responseInfo.allResponseHeaders = xhr.getAllResponseHeaders();
                    responseInfo.headers = (SP as any).RequestExecutor.ParseHeaders(responseInfo.allResponseHeaders);
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 1223) {
                        if (requestInfo.success) {
                            requestInfo.success(responseInfo);
                        }
                    }
                    else {
                        var error = SP.RequestExecutorErrors.httpError;
                        var statusText = xhr.statusText;

                        if (requestInfo.error) {
                            requestInfo.error(responseInfo, error, statusText);
                        }
                    }
                }
            };
        });

        // $.getScript(caller.parent.srcUrl + "/_layouts/15/SP.RequestExecutor.js").done(function (script, textStatus) {
        // executes cross domain request
        var executor = new SP.RequestExecutor(this.appWebUrl);
        return new Promise(function (resolve, reject) {
            executor.executeAsync(
                {
                    url: caller.parent.srcUrl + "/_api/web/GetFileByServerRelativeUrl('" + caller.srcUrl + "')/$value",
                    method: "GET",
                    binaryStringResponseBody: true,
                    success: function (data) {
                        caller.fileContent = data.body;
                        resolve();
                    },
                    error: function (xhr) {
                        reject(xhr.state + ": " + xhr.statusText);
                    }
                });


        });
    }
*/
    /* postFile(data, caller) {
         let that = this;
         var executor = new SP.RequestExecutor(this.appWebUrl);
         executor.executeAsync(
             {
                 url: that.appWebUrl + "/_api/SP.AppContextSite(@target)/web/GetFileByServerRelativeUrl('" + filepath + "')/$value?@target='" + caller.parent.srcUrl + "'",
                 method: "POST",
                 success: function (data) { that.createFile(data, caller) },
                 error: function (xhr) {
                     alert(xhr.state + ": " + xhr.statusText)
                 }
             });
 
     }
     
 
     copyFile3(caller) {
 
         var clientContext;
         var oWebsite;
         var fileUrl;
         let that = this;
 
         clientContext = SP.ClientContext.get_current();
         oWebsite = new SP.AppContextSite(clientContext, caller.parent.srcUrl).get_web();
 
         var factory = new SP.ProxyWebRequestExecutorFactory(this.appWebUrl);
         clientContext.set_webRequestExecutorFactory(factory);
 
         clientContext.load(oWebsite);
         clientContext.executeQueryAsync(function () {
             fileUrl = oWebsite.get_serverRelativeUrl() + "/" + caller.parent.title + "/" +"ProviderHostedApps%20-%20Infos.txt";
             $.ajax({
                 url: fileUrl,
                 type: "GET"
             })
                 .done(function () { console.log("Success Ajax: " + arguments[2]); }, function () { console.error("Req failed: " + arguments[2]); });
         }, errorHandler);
 
         function successHandler(data) {
             that.createFile(data, caller);
         }
 
         function errorHandler() {
             console.error("Request failed: " + arguments[2]);
         }
 
 
 
 
     }
     */

    getContent(caller: ItemDL) {
        var targetLib = caller.parent.targetTitle;
        let that = this;
        var listItem: SP.ListItem;

        var ctx = new SP.ClientContext(caller.parent.srcUrl);
       // var appContextSite = new SP.AppContextSite(ctx, caller.parent.srcUrl);
        listItem = ctx.get_web().get_lists().getByTitle(caller.parent.title).getItemById(caller.id);
        var cType = listItem.get_contentType();
        

        ctx.load(listItem);
        ctx.load(cType);

        return new Promise(function (resolve, reject) {
            ctx.executeQueryAsync(
                function () {


                    if (listItem.get_fileSystemObjectType() == SP.FileSystemObjectType.folder) {
                        if (cType.get_id().toString().startsWith("0x0120D520")) {
                           // console.log("Doc Set: " + caller.id);

                            caller.type = ContentType.DocSet;
                            //cTypeId.substring(0,cTypeId.lastIndexOf("00"))
                            caller.contentTypeId = cType.get_id().toString().substring(0,cType.get_id().toString().lastIndexOf("00"));
                            caller.contentTypeName = cType.get_name();
                           // console.log(caller.contentTypeName);
                        }
                        else {
                           // console.log("Folder: " + caller.id);
                            caller.type = ContentType.Folder;
                        }
                    }
                    else if (listItem.get_fileSystemObjectType() == SP.FileSystemObjectType.file) {
                       //console.log("File: " + caller.id);
                        caller.type = ContentType.File;
                    }
                    else {
                        //console.log("Unknown " + caller.id);
                        reject("Unknown File format in" + caller.id);
                    }

                    resolve();
                },
                function () {

                    reject(arguments[1].get_message());
                }

            );
        });
    }


    getFolder(caller: ItemDL) {
        let that = this;
     
        var targetList: SP.List;
        var listItem: SP.ListItem;
        var ctx = new SP.ClientContext(caller.parent.srcUrl);
        //var appContextSite = new SP.AppContextSite(ctx, caller.parent.srcUrl);

        listItem = ctx.get_web().get_lists().getByTitle(caller.parent.title).getItemById(caller.id);
        var files = listItem.get_folder().get_files();
        var folders = listItem.get_folder().get_folders();



        ctx.load(listItem);
        ctx.load(files, 'Include(ListItemAllFields)');
        ctx.load(folders, 'Include(ListItemAllFields)');
      
       


        return new Promise(function (resolve, reject) {
            ctx.executeQueryAsync(
                function () {

                    caller.name = listItem.get_item('Title');
                    //(listItem.get_item('Title') as SP.Folder).get_files();

                    for (var i = 0; i < files.get_count(); i++) {
                       // console.log(files.getItemAtIndex(i).get_listItemAllFields().get_id());

                        caller.addToQueue(files.getItemAtIndex(i).get_listItemAllFields().get_id());
                       
                    }

                    for (var i = 0; i < folders.get_count(); i++) {
                        caller.addToQueue(folders.getItemAtIndex(i).get_listItemAllFields().get_id());
                        

                    }

                    caller.folderURL += caller.name + "/";

                    resolve();

                },
                function () {
                    reject(arguments[1].get_message());
                }
            );
        });
    }

   
    // Muss die neuen Objekte hier starten um Fehlern vorzubeugen
    copyFolder(caller: ItemDL) {
     /*   let that = this;

        var executor = new SP.RequestExecutor(this.appWebUrl);
        return new Promise(function (resolve, reject) {
            executor.executeAsync(
                {
                    url: that.appWebUrl + "/_api/SP.AppContextSite(@target)/web/folders/add('"+caller.parent.title+"/"+caller.folderURL+"')",
                    method: "GET",
                    binaryStringResponseBody: true,
                    success: function (data) { caller.fileContent = data.body; resolve(); },
                    error: function (xhr) {
                        reject(xhr.state + ": " + xhr.statusText);
                    }
                });


        });*/


       var targetList: SP.List;
        var listItem: SP.ListItem;

        var ctx = new SP.ClientContext(caller.parent.targetUrl);
       // var appContextSite = new SP.AppContextSite(ctx, caller.parent.targetUrl);

        var itemCreateInfo: SP.ListItemCreationInformation;

        targetList = ctx.get_web().get_lists().getByTitle(caller.parent.targetTitle);
        var thisFolder : SP.Folder;
       // folderItem.
        ctx.load(targetList);

        if (caller.parentFolderId == null) {


            thisFolder = targetList.get_rootFolder().get_folders().add(caller.name);
        }
        else {
         
          thisFolder = targetList.getItemById(caller.parentFolderId).get_folder().get_folders().add(caller.name);
        } // Überarbeiten

     //   console.log(caller.parentFolder.get_folders());
        ctx.load(thisFolder, "ListItemAllFields");
        ctx.load(thisFolder);
        return new Promise(function (resolve, reject) {
            ctx.executeQueryAsync(
                function () {
                   // caller.parentFolder= thisFolder;
                    caller.parentFolderId = thisFolder.get_listItemAllFields().get_id();
                    caller.releaseQueue();
                    resolve();

                },
                function (x, args) {
                /*    if (args.get_errorTypeName() == "Microsoft.SharePoint.SPException" && args.get_message().includes("already exists")) {

                        console.log("Already exists " + caller.id);
                        caller.releaseQueue();
                        resolve();

                    }*/
                    reject(arguments[1].get_message());
                   
                }
            );
        });

    }


    // Muss die neuen Objekte hier starten um Fehlern vorzubeugen
    copyDocSet(caller: ItemDL) {

        let that = this;

         var targetList: SP.List;
         var listItem: SP.ListItem;
         var root : SP.Folder;
         var ctx = new SP.ClientContext(caller.parent.targetUrl);
        // var appContextSite = new SP.AppContextSite(ctx, caller.parent.targetUrl);
 
         targetList = ctx.get_web().get_lists().getByTitle(caller.parent.targetTitle);

         if (caller.parentFolderId == null)
             root = targetList.get_rootFolder();
         else
             root = targetList.getItemById(caller.parentFolderId).get_folder();

         ctx.load(targetList);
         var cTypeId = caller.contentTypeId;

         var newCT: SP.ContentType = ctx.get_web().get_contentTypes().getById(cTypeId);
       
         ctx.load(root);
         ctx.load(newCT);

         return new Promise(function (resolve, reject) {
             ctx.executeQueryAsync(
                 function () {
                      SP.DocumentSet.DocumentSet.create(ctx, root, caller.name, newCT.get_id());
                      ctx.executeQueryAsync(
                        function(){
                            that.getFolderFromDocSet(caller).then(
                            response => {
                                caller.releaseQueue();
                                resolve();
                            },
                            response =>{

                                    reject("0:"+response)                         
                            });
                          },
                          function(){
                             if(arguments[1].get_message().includes("already exists"))
                             {
                                that.getFolderFromDocSet(caller).then(
                                    response => {
                                        caller.releaseQueue();
                                   	    resolve();
                                    },
                                    response =>{
                                        reject("2:"+response)                         
                                });
                             }
                             else
                                reject("1:"+arguments[1].get_message());
                          });
                 },
                 function (x, args) {


                        reject("3:"+arguments[1].get_message());
                 }
             );
         });

    }

    getFolderFromDocSet(caller: ItemDL) {


        let that = this;
        var targetList: SP.List;
        var listItem: SP.ListItem;
        var folders : SP.FolderCollection; 
        var ctx = new SP.ClientContext(caller.parent.targetUrl);
        //var appContextSite = new SP.AppContextSite(ctx, caller.parent.targetUrl);
         targetList = ctx.get_web().get_lists().getByTitle(caller.parent.targetTitle);
      //   if (caller.parentFolderId == null)
            folders = targetList.get_rootFolder().get_folders();
      //   else
       //     folders = targetList.getItemById(caller.parentFolderId).get_folder().get_folders();

        ctx.load(targetList);
        ctx.load(folders, 'Include(ListItemAllFields)');
        ctx.load(folders);


        return new Promise(function (resolve,reject){
            ctx.executeQueryAsync(
                function () {
                   
                   // console.log(folders);
                    for (var i = 0; i < folders.get_count(); i++) {
                    //    console.log(folders.getItemAtIndex(i)); 
                        if (folders.getItemAtIndex(i).get_name() == caller.name) {
                          //  console.log(folders.getItemAtIndex(i).get_name());
                           // caller.parentFolder = folders.getItemAtIndex(i);
                            caller.parentFolderId = folders.getItemAtIndex(i).get_listItemAllFields().get_id();
                            caller.targetId = folders.getItemAtIndex(i).get_listItemAllFields().get_id();
                            resolve();
                        }
                    }

                    //caller.parentFolder = responseFolders;
                    reject(false);

                },
                function () {
                    reject(arguments[1].get_message());}
                

            );

        });
    }

    readListItem(caller: ItemDL) {
        let that = this;

        var ctx = new SP.ClientContext(caller.parent.srcUrl);
       // var appContextSite = new SP.AppContextSite(ctx, caller.parent.srcUrl);
        var hostweb = ctx.get_web();
        var lists = hostweb.get_lists();
        var listItem: SP.ListItem;

        ctx.load(hostweb);


        listItem = hostweb.get_lists().getByTitle(caller.parent.title).getItemById(caller.id);
        //   if (listItem.get_fileSystemObjectType() == SP.FileSystemObjectType.folder) {
        var file = listItem.get_file();


        ctx.load(listItem);
        ctx.load(file);


        return new Promise(function (resolve, reject) {
            ctx.executeQueryAsync(
                function () {

                    caller.name = file.get_name();
                    caller.srcUrl = file.get_serverRelativeUrl();
                    caller.title = file.get_title();

                   for(var i=0; i<caller.parent.fields.length; i++)
                   {
                       
                        caller.contents.push(new FieldContent(listItem.get_item(caller.parent.fields[i].name),caller.parent.fields[i]));
                   }

                    resolve();

                },
                function () {
                    reject(arguments[1].get_message());
                });
        });

    }

    fillListItem(caller: ItemDL) {
  
        var ctx = new SP.ClientContext(caller.parent.targetUrl);
       // var appContextSite = new SP.AppContextSite(ctx, caller.parent.targetUrl).get_web();
        var targetList = ctx.get_web().get_lists().getByTitle(caller.parent.targetTitle);
        var targetItem = targetList.getItemById(caller.targetId);       
        var targetFieldt = targetList.get_fields().getByInternalNameOrTitle("Data1");
      //  var targetFieldt2 = targetList.get_fields().getByInternalNameOrTitle("BASF2");
     //  var targetField = ctx.castTo(targetFieldt, SP.Taxonomy.TaxonomyField);
     //   var targetField2 = ctx.castTo(targetFieldt2, SP.Taxonomy.TaxonomyField);

        var targets = new Array();

for(var i = 0; i<caller.contents.length;i++){
    if(caller.contents[i].field.type=="TaxonomyFieldTypeMulti")
        targets.push(ctx.castTo(targetList.get_fields().getByInternalNameOrTitle(caller.contents[i].field.name),SP.Taxonomy.TaxonomyField));
    else
        targets.push(targetList.get_fields().getByInternalNameOrTitle(caller.contents[i].field.name));

        ctx.load(targets[i]);
        
}
        ctx.load(targetItem);
    //    ctx.load(targetField);
     //   ctx.load(targetField2);
       
        return new Promise(function (resolve, reject) {
            ctx.executeQueryAsync(
                //Success
                function (data) {

                    for(var i = 0; i<caller.contents.length;i++){
                         if(caller.contents[i].field.type=="TaxonomyFieldTypeMulti")
                         {
                            var termValues = new SP.Taxonomy.TaxonomyFieldValueCollection(ctx, caller.contents[i].value , (targets[i] as SP.Taxonomy.TaxonomyField));

                            (targets[i] as SP.Taxonomy.TaxonomyField).setFieldValueByValueCollection(targetItem, termValues);
                         }
                         else
                         {
                             
                             targetItem.parseAndSetFieldValue(caller.contents[i].field.name,caller.contents[i].value);
                         }
                    }

                   


                    targetItem.update();
                    ctx.executeQueryAsync(
                        function(){resolve();},
                        function(){ reject(arguments[1].get_message());}
                    );
                   // console.log(targetItem);
                   // resolve();

                },
                //Fail
                function (data) {
                    reject(arguments[1].get_message());

                }


            );
        });


    }

    readFile(pathUrl: string) {
        var executor = new SP.RequestExecutor(this.appWebUrl);
        //var executor = new SP.RequestExecutor(pathUrl);
        let that = this;

        return new Promise(function (resolve, reject) {
            executor.executeAsync(
                {

                    url: pathUrl + "/_api/web/GetFileByServerRelativeUrl('" + pathUrl + "')/Folders",
                    //Leere Bibliotheken werden ignoriert , beheben?
                    //url: (pathUrl+"/_api/web/GetFolderByServerRelativeUrl('"+relPath+"')"),

                    method: "GET",
                    headers: { "Accept": "application/json; odata=verbose" },
                    success: function (data) {
                        var myoutput = JSON.parse((data.body.toString()));
                        var directory = [];

                        var siteResult = myoutput.d.results;

                        for (var x = 0; x < siteResult.length; x++) {

                            directory.push(
                                new Directory(that.searchJSONWebApi(siteResult[x], "Name"), parent));
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
}