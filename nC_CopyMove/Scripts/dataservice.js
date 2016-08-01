System.register(['angular2/core', './sitecollection', './documentlibrary', './directory', './itemdl'], function(exports_1, context_1) {
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
    var core_1, sitecollection_1, documentlibrary_1, directory_1, itemdl_1;
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
            },
            function (itemdl_1_1) {
                itemdl_1 = itemdl_1_1;
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
                                    //console.log(siteResult);
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
                                for (var x = 0; x < siteResult.length; x++) {
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
                getElementById(pathUrl, listTitle, id, parent) {
                    var executor = new SP.RequestExecutor(this.appWebUrl);
                    let that = this;
                    return new Promise(function (resolve, reject) {
                        executor.executeAsync({
                            url: that.appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/GetByTitle('" + listTitle + "')/items(" + id + ")?@target='" + pathUrl + "'",
                            method: "GET",
                            headers: { "Accept": "application/json; odata=verbose" },
                            success: function (data) {
                                var myoutput = JSON.parse((data.body.toString()));
                                var itemdl = [];
                                var siteResult = myoutput.d;
                                for (var x = 0; x < siteResult.length; x++) {
                                    itemdl.push(new itemdl_1.ItemDL(id, parent));
                                }
                                resolve(itemdl);
                            },
                            error: function (data) {
                                var directory = [];
                                reject(directory);
                            }
                        });
                    });
                }
                /*
                getFileBuffer(file) {
                    var deffered = $.Deferred();
            
                    var reader = new FileReader();
                    reader.onload = function (e: any) {
                        deffered.resolve(e.target.result);
                    }
                    reader.onerror = function (e: any) {
                        deffered.reject(e.target.error);
                    }
                    reader.readAsArrayBuffer(file);
                    return deffered.promise();
                }
            
                getFileAsBufferArray(url, index) {
                    let that = this;
                    var def = $.Deferred();
                    var x = new XMLHttpRequest();
                    x.open("GET", url);
                    x.responseType = "blob";
                    x.onloadend = function () {
                        that.getFileBuffer(x.response).done(function (buffer) {
                            def.resolve(buffer, index);
                        });
                    }
                    x.onerror = function (err) {
                        def.reject(err);
                        console.error(err);
                    }
                    x.send();
                    return def.promise();
            
             
                }
               
                copyFile5(caller) {
            
                 
                // set up the src client
                var srcContext = new SP.ClientContext(caller.parent.srcUrl);
            
                // set up the destination context (in your case there is no needs to create a new context, because it would be the same library!!!!)
                SP.ClientContext destContext = new SP.ClientContext(destUrl);
                destContext.AuthenticationMode = SP.ClientAuthenticationMode.FormsAuthentication;
                destContext.FormsAuthenticationLoginInfo = new SP.FormsAuthenticationLoginInfo(_login.UserName, _login.Password);
            
                // get the list and items
                SP.Web srcWeb = srcContext.Web;
                SP.List srcList = srcWeb.Lists.GetByTitle(srcLibrary);
                SP.ListItemCollection col = srcList.GetItems(new SP.CamlQuery());
                srcContext.Load(col);
                srcContext.ExecuteQuery();
            
                // get the new list
                SP.Web destWeb = destContext.Web;
                destContext.Load(destWeb);
                destContext.ExecuteQuery();
            
                foreach(var doc in col)
                {
                    try {
                        if (doc.FileSystemObjectType == SP.FileSystemObjectType.File) {
                            // get the file
                            SP.File f = doc.File;
                            srcContext.Load(f);
                            srcContext.ExecuteQuery();
            
                            // build new location url
                            string nLocation = destWeb.ServerRelativeUrl.TrimEnd('/') + "/" + destLibrary.Replace(" ", "") + "/" + f.Name;
            
                            // read the file, copy the content to new file at new location
                            SP.FileInformation fileInfo = SP.File.OpenBinaryDirect(srcContext, f.ServerRelativeUrl);
                            SP.File.SaveBinaryDirect(destContext, nLocation, fileInfo.Stream, true);
                        }
            
                        if (doc.FileSystemObjectType == SP.FileSystemObjectType.Folder) {
                            // load the folder
                            srcContext.Load(doc);
                            srcContext.ExecuteQuery();
            
                            // get the folder data, get the file collection in the folder
                            SP.Folder folder = srcWeb.GetFolderByServerRelativeUrl(doc.FieldValues["FileRef"].ToString());
                            SP.FileCollection fileCol = folder.Files;
            
                            // load everyting so we can access it
                            srcContext.Load(folder);
                            srcContext.Load(fileCol);
                            srcContext.ExecuteQuery();
            
                            foreach(SP.File f in fileCol)
                            {
                                // load the file
                                srcContext.Load(f);
                                srcContext.ExecuteQuery();
            
                                string[] parts = null;
                                string id = null;
            
                                if (srcLibrary == "My Files") {
                                    // these are doc sets
                                    parts = f.ServerRelativeUrl.Split('/');
                                    id = parts[parts.Length - 2];
                                }
                                else {
                                    id = folder.Name;
                                }
            
                                // build new location url
                                string nLocation = destWeb.ServerRelativeUrl.TrimEnd('/') + "/" + destLibrary.Replace(" ", "") + "/" + id + "/" + f.Name;
            
                                // read the file, copy the content to new file at new location
                                SP.FileInformation fileInfo = SP.File.OpenBinaryDirect(srcContext, f.ServerRelativeUrl);
                                SP.File.SaveBinaryDirect(destContext, nLocation, fileInfo.Stream, true);
                            }
                        }
                    }
                    catch (Exception ex) {
                        console.log("File Error = " + ex.ToString());
                    }
               
            }
                
            
                copyFile2(caller) {
            
            
                    return new Promise(function (resolve, reject) {
                        var def = $.Deferred();
                        var x = new XMLHttpRequest();
                        x.open("GET", caller.parent.srcUrl + "/" + caller.parent.title);
                        x.responseType = "blob";
                        x.onloadend = function () {
                            this.getFileBuffer(x.response).done(function (buffer) {
                                this.UploadFile("http://win-iprrvsfootq/sites/dev", caller.parent.targetUrl, "Test.txt", buffer).done(function () {
                                    def.resolve();
                                },function(err){
                                    def.reject(err);
                                    console.error(err);
                                });
                            });
                        }
                        x.onerror = function (err) {
                            def.reject(err);
                            console.error(err);
                        }
                        x.send();
                        return def.promise();
                       
                    });
            
                }
            
                */
                downloadFile(caller) {
                    let that = this;
                    $.getScript(that.appWebUrl + "/_layouts/15/SP.RequestExecutor.js", function () {
                        SP.RequestExecutorInternalSharedUtility.BinaryDecode = function SP_RequestExecutorInternalSharedUtility$BinaryDecode(data) {
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
                        SP.RequestExecutorUtility.IsDefined = function SP_RequestExecutorUtility$$1(data) {
                            var nullValue = null;
                            return data === nullValue || typeof data === 'undefined' || !data.length;
                        };
                        SP.RequestExecutor.ParseHeaders = function SP_RequestExecutor$ParseHeaders(headers) {
                            if (SP.RequestExecutorUtility.IsDefined(headers)) {
                                return null;
                            }
                            var result = {};
                            var reSplit = new RegExp('\r?\n');
                            var headerArray = headers.split(reSplit);
                            for (var i = 0; i < headerArray.length; i++) {
                                var currentHeader = headerArray[i];
                                if (!SP.RequestExecutorUtility.IsDefined(currentHeader)) {
                                    var splitPos = currentHeader.indexOf(':');
                                    if (splitPos > 0) {
                                        var key = currentHeader.substr(0, splitPos);
                                        var value = currentHeader.substr(splitPos + 1);
                                        key = SP.RequestExecutorNative.trim(key);
                                        value = SP.RequestExecutorNative.trim(value);
                                        result[key.toUpperCase()] = value;
                                    }
                                }
                            }
                            return result;
                        };
                        SP.RequestExecutor.internalProcessXMLHttpRequestOnreadystatechange = function SP_RequestExecutor$internalProcessXMLHttpRequestOnreadystatechange(xhr, requestInfo, timeoutId) {
                            if (xhr.readyState === 4) {
                                if (timeoutId) {
                                    window.clearTimeout(timeoutId);
                                }
                                xhr.onreadystatechange = SP.RequestExecutorNative.emptyCallback;
                                var responseInfo = new SP.ResponseInfo();
                                responseInfo.state = requestInfo.state;
                                responseInfo.responseAvailable = true;
                                if (requestInfo.binaryStringResponseBody) {
                                    responseInfo.body = SP.RequestExecutorInternalSharedUtility.BinaryDecode(xhr.response);
                                }
                                else {
                                    responseInfo.body = xhr.responseText;
                                }
                                responseInfo.statusCode = xhr.status;
                                responseInfo.statusText = xhr.statusText;
                                responseInfo.contentType = xhr.getResponseHeader('content-type');
                                responseInfo.allResponseHeaders = xhr.getAllResponseHeaders();
                                responseInfo.headers = SP.RequestExecutor.ParseHeaders(responseInfo.allResponseHeaders);
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
                        executor.executeAsync({
                            url: that.appWebUrl + "/_api/SP.AppContextSite(@target)/web/GetFileByServerRelativeUrl('" + caller.srcUrl + "')/$value?@target='" + caller.parent.srcUrl + "'",
                            method: "GET",
                            binaryStringResponseBody: true,
                            success: function (data) { caller.fileContent = data.body; resolve(); },
                            error: function (xhr) {
                                reject(xhr.state + ": " + xhr.statusText);
                            }
                        });
                    });
                }
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
                getContent(caller) {
                    var targetLib = caller.parent.targetTitle;
                    let that = this;
                    var listItem;
                    var ctx = SP.ClientContext.get_current();
                    var appContextSite = new SP.AppContextSite(ctx, caller.parent.srcUrl);
                    listItem = appContextSite.get_web().get_lists().getByTitle(caller.parent.title).getItemById(caller.id);
                    var cType = listItem.get_contentType();
                    ctx.load(listItem);
                    ctx.load(cType);
                    return new Promise(function (resolve, reject) {
                        ctx.executeQueryAsync(function () {
                            if (listItem.get_fileSystemObjectType() == SP.FileSystemObjectType.folder) {
                                if (cType.get_id().toString().startsWith("0x0120D520")) {
                                    console.log("Doc Set: " + caller.id);
                                    caller.type = itemdl_1.ContentType.DocSet;
                                    caller.contentTypeId = cType.get_id();
                                }
                                else {
                                    console.log("Folder: " + caller.id);
                                    caller.type = itemdl_1.ContentType.Folder;
                                }
                            }
                            else if (listItem.get_fileSystemObjectType() == SP.FileSystemObjectType.file) {
                                console.log("File: " + caller.id);
                                caller.type = itemdl_1.ContentType.File;
                            }
                            else {
                                console.log("Unknown " + caller.id);
                                reject("Unknown File format in" + caller.id);
                            }
                            resolve();
                        }, function () {
                            reject(arguments[1].get_message());
                        });
                    });
                }
                getFolder(caller) {
                    let that = this;
                    var targetList;
                    var listItem;
                    var ctx = SP.ClientContext.get_current();
                    var appContextSite = new SP.AppContextSite(ctx, caller.parent.srcUrl);
                    listItem = appContextSite.get_web().get_lists().getByTitle(caller.parent.title).getItemById(caller.id);
                    var files = listItem.get_folder().get_files();
                    var folders = listItem.get_folder().get_folders();
                    ctx.load(listItem);
                    ctx.load(files, 'Include(ListItemAllFields)');
                    ctx.load(folders, 'Include(ListItemAllFields)');
                    return new Promise(function (resolve, reject) {
                        ctx.executeQueryAsync(function () {
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
                        }, function () {
                            reject(arguments[1].get_message());
                        });
                    });
                }
                // Muss die neuen Objekte hier starten um Fehlern vorzubeugen
                copyFolder(caller) {
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
                    var targetList;
                    var listItem;
                    var ctx = SP.ClientContext.get_current();
                    var appContextSite = new SP.AppContextSite(ctx, caller.parent.targetUrl);
                    var itemCreateInfo;
                    targetList = appContextSite.get_web().get_lists().getByTitle(caller.parent.targetTitle);
                    // folderItem.
                    ctx.load(targetList);
                    if (caller.parentFolder == null) {
                        /*
                                    itemCreateInfo = new SP.ListItemCreationInformation();
                                    itemCreateInfo.set_underlyingObjectType(SP.FileSystemObjectType.folder);
                                    itemCreateInfo.set_leafName(caller.name);
                        
                        
                        
                                    var folderItem: SP.ListItem;
                                    folderItem = targetList.addItem(itemCreateInfo);
                        
                        
                                    folderItem.update();
                                    var thisFolder: SP.Folder = folderItem.get_folder();
                                    // thisFolder.get_folders().add
                        
                                    ctx.load(folderItem);
                                    */
                        var thisFolder = targetList.get_rootFolder().get_folders().add(caller.name);
                    }
                    else {
                        var thisFolder = caller.parentFolder.get_folders().add(caller.name);
                    }
                    ctx.load(thisFolder);
                    return new Promise(function (resolve, reject) {
                        ctx.executeQueryAsync(function () {
                            caller.parentFolder = thisFolder;
                            caller.releaseQueue();
                            resolve();
                        }, function (x, args) {
                            /*    if (args.get_errorTypeName() == "Microsoft.SharePoint.SPException" && args.get_message().includes("already exists")) {
            
                                    console.log("Already exists " + caller.id);
                                    caller.releaseQueue();
                                    resolve();
            
                                }*/
                            reject(arguments[1].get_message());
                        });
                    });
                }
                // Muss die neuen Objekte hier starten um Fehlern vorzubeugen
                copyDocSet(caller) {
                    let that = this;
                    var targetList;
                    var listItem;
                    var ctx = SP.ClientContext.get_current();
                    var appContextSite = new SP.AppContextSite(ctx, caller.parent.targetUrl);
                    var itemCreateInfo;
                    targetList = appContextSite.get_web().get_lists().getByTitle(caller.parent.targetTitle);
                    if (caller.parentFolder == null)
                        var root = targetList.get_rootFolder();
                    else
                        var root = caller.parentFolder;
                    ctx.load(targetList);
                    var cTypeId = caller.contentTypeId.toString();
                    var newCT = appContextSite.get_web().get_contentTypes().getById(cTypeId.substring(0, cTypeId.lastIndexOf("00")));
                    // console.log("This CTypeId: "+cTypeId.substring(0,cTypeId.lastIndexOf("00")));
                    //var docSetContentType = appContextSite.get_web().get_contentTypes().getById(caller.contentTypeId);
                    ctx.load(root);
                    ctx.load(newCT);
                    return new Promise(function (resolve, reject) {
                        ctx.executeQueryAsync(function () {
                            // console.log(newCT);
                            that.getFolderFromDocSet(root, caller).then(response => {
                                caller.releaseQueue();
                                resolve();
                            }, response => {
                                if (response == false) {
                                    SP.DocumentSet.DocumentSet.create(ctx, root, caller.name, newCT.get_id());
                                    resolve();
                                }
                                else
                                    reject(response);
                            });
                        }, function (x, args) {
                            reject(arguments[1].get_message());
                        });
                    });
                }
                getFolderFromDocSet(root, caller) {
                    let that = this;
                    var targetList;
                    var listItem;
                    var ctx = SP.ClientContext.get_current();
                    var appContextSite = new SP.AppContextSite(ctx, caller.parent.targetUrl);
                    var folders = root.get_folders();
                    ctx.load(folders);
                    return new Promise(function (resolve, reject) {
                        ctx.executeQueryAsync(function () {
                            for (var i = 0; i < folders.get_count(); i++) {
                                if (folders.getItemAtIndex(i).get_name() == caller.name) {
                                    caller.parentFolder = folders.getItemAtIndex(i);
                                    resolve();
                                }
                            }
                            //caller.parentFolder = responseFolders;
                            reject(false);
                        }, function () {
                            reject(arguments[1].get_message());
                        });
                    });
                }
                readFileToCopy(caller) {
                    let that = this;
                    var ctx = SP.ClientContext.get_current();
                    var appContextSite = new SP.AppContextSite(ctx, caller.parent.srcUrl);
                    var hostweb = appContextSite.get_web();
                    var lists = hostweb.get_lists();
                    var listItem;
                    ctx.load(hostweb);
                    listItem = hostweb.get_lists().getByTitle(caller.parent.title).getItemById(caller.id);
                    //   if (listItem.get_fileSystemObjectType() == SP.FileSystemObjectType.folder) {
                    var file = listItem.get_file();
                    ctx.load(listItem);
                    ctx.load(file);
                    return new Promise(function (resolve, reject) {
                        ctx.executeQueryAsync(function () {
                            //b console.log(caller.parent.title);
                            // console.log(file);
                            caller.name = file.get_name();
                            caller.srcUrl = file.get_serverRelativeUrl();
                            caller.title = file.get_title();
                            caller.data1 = listItem.get_item("Data1");
                            resolve();
                            // that.downloadFile(caller, file.get_serverRelativeUrl());
                        }, function () {
                            reject(arguments[1].get_message());
                        });
                    });
                }
                createFile(caller) {
                    var targetList;
                    var fileCreateInfo;
                    var fileContent;
                    let that = this;
                    var ctx = SP.ClientContext.get_current();
                    var appContextSite = new SP.AppContextSite(ctx, caller.parent.targetUrl).get_web();
                    targetList = appContextSite.get_lists().getByTitle(caller.parent.targetTitle);
                    fileCreateInfo = new SP.FileCreationInformation();
                    fileCreateInfo.set_url(caller.parent.targetUrl + "/" + caller.parent.targetTitle + "/" + caller.folderURL + caller.name);
                    // console.log("This Folder " + caller.folderURL + "/Item: " + caller.id);
                    fileCreateInfo.set_overwrite(true);
                    fileCreateInfo.set_content(new SP.Base64EncodedByteArray());
                    fileContent = caller.fileContent;
                    //fileCreateInfo.set_folderUrl(caller.parent.targetUrl + "/" + caller.folderURL + caller.name);
                    for (var i = 0; i < fileContent.length; i++) {
                        fileCreateInfo.get_content().append(fileContent.charCodeAt(i));
                    }
                    var newFile = targetList.get_rootFolder().get_files().add(fileCreateInfo);
                    ctx.load(newFile, 'ListItemAllFields');
                    /*
                          var targetField = newFile.get_listItemAllFields["Data1"] as SP.Taxonomy.TaxonomyField;
                          var listItem = newFile.get_listItemAllFields();
                    
                          ctx.load(listItem);
                          ctx.load(targetField);*/
                    return new Promise(function (resolve, reject) {
                        ctx.executeQueryAsync(
                        //Success
                        function (data) {
                            caller.targetId = newFile.get_listItemAllFields().get_id();
                            resolve();
                        }, 
                        //Fail
                        function (data) {
                            reject(arguments[1].get_message());
                        });
                    });
                }
                fillListItem(caller) {
                    // var targetListItem: SP.ListItem;
                    var termId = '<term guid>';
                    var termLabel = '<term label>';
                    var ctx = SP.ClientContext.get_current();
                    // console.log(caller.parent.targetTitle + " / " + caller.targetId);
                    var appContextSite = new SP.AppContextSite(ctx, caller.parent.targetUrl).get_web();
                    // targetListItem = appContextSite.get_lists().getByTitle(caller.parent.targetTitle).getItemById(caller.targetId);
                    var targetList = appContextSite.get_lists().getByTitle(caller.parent.targetTitle);
                    var targetItem = targetList.getItemById(caller.targetId);
                    // ctx.load(targetList);
                    ctx.load(targetItem);
                    var targetFieldt = targetList.get_fields().getByInternalNameOrTitle("Data1");
                    // var targetFieldTax = ctx.castTo(targetField, SP.Taxonomy.TaxonomyField);
                    var targetField = ctx.castTo(targetFieldt, SP.Taxonomy.TaxonomyField);
                    //  var targetFieldValCol: SP.Taxonomy.TaxonomyFieldValueCollection = new SP.Taxonomy.TaxonomyFieldValueCollection(targetField as SP.Taxonomy.TaxonomyField);
                    ctx.load(targetField);
                    return new Promise(function (resolve, reject) {
                        ctx.executeQueryAsync(
                        //Success
                        function (data) {
                            if (targetField.get_allowMultipleValues()) {
                                var terms = new Array();
                                var termValueString;
                                var termValues;
                                for (var i = 0; i < caller.data1.get_count(); i++) {
                                    terms.push("-1;#" + caller.data1.getItemAtIndex(i).get_label() + "|" + caller.data1.getItemAtIndex(i).get_termGuid());
                                }
                                //Update
                                termValueString = terms.join(";#");
                            }
                            termValues = new SP.Taxonomy.TaxonomyFieldValueCollection(ctx, termValueString, targetField);
                            targetField.setFieldValueByValueCollection(targetItem, termValues);
                            targetItem.update();
                            resolve();
                        }, 
                        //Fail
                        function (data) {
                            reject(arguments[1].get_message());
                        });
                    });
                }
                /*
                    UploadFile(webUrl, lib, filename, buffer) {
                    var d = $.Deferred();
                    jQuery.ajax({
                        url: webUrl + "/_api/contextinfo",
                        type: "POST",
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        },
                        contentType: "application/json;odata=verbose",
                        success: function (data) {
                            var digest = data.d.GetContextWebInformation.FormDigestValue;
                            $.ajax({
                                //url: webUrl + "/_api/web/GetFolderByServerRelativeUrl('" + webUrl + '/' + lib + "')/Files" +
                                //    "/Add(url='" + filename + "', overwrite=true)",
                                url: webUrl + "/_api/web/lists/getbytitle('" + lib + "')/rootfolder/files/add(url='" + filename + "', overwrite=true)",
                                type: "POST",
                                data: buffer,
                                processData: false,
                                headers: {
                                    "accept": "application/json;odata=verbose",
                                    "X-RequestDigest": digest,
                                    "content-lengh": buffer.byteLength
                                },
                                success: function (data) {
                                    d.resolve();
                                },
                                error: function (err) {
                                    d.reject();
                                    console.log(err);
                                }
                            });
                
                
                
                
                
                        }, error: function (data) {
                            console.log(data);
                        }
                    });
                
                    return d.promise();
                }*/
                readFile(pathUrl) {
                    var executor = new SP.RequestExecutor(this.appWebUrl);
                    //var executor = new SP.RequestExecutor(pathUrl);
                    let that = this;
                    return new Promise(function (resolve, reject) {
                        executor.executeAsync({
                            url: that.appWebUrl + "/_api/SP.AppContextSite(@target)/web/GetFileByServerRelativeUrl('" + pathUrl + "')/Folders?@target='" + pathUrl + "'",
                            //Leere Bibliotheken werden ignoriert , beheben?
                            //url: (pathUrl+"/_api/web/GetFolderByServerRelativeUrl('"+relPath+"')"),
                            method: "GET",
                            headers: { "Accept": "application/json; odata=verbose" },
                            success: function (data) {
                                var myoutput = JSON.parse((data.body.toString()));
                                var directory = [];
                                var siteResult = myoutput.d.results;
                                for (var x = 0; x < siteResult.length; x++) {
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