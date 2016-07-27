import {Injectable} from 'angular2/core';
import {SiteCollection} from './sitecollection';
import {DocumentLibrary} from './documentlibrary';
import {Directory} from './directory';
import {ItemDL} from './itemdl';

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

    searchDocumentLibrary(pathURL, parent) {

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

                    url: that.appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists/GetByTitle('" + listTitle + "')/items(" + id + ")?@target='" + pathUrl + "'",
                    method: "GET",
                    headers: { "Accept": "application/json; odata=verbose" },
                    success: function (data) {
                        var myoutput = JSON.parse((data.body.toString()));
                        var itemdl = [];
                        console.log(myoutput);
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
    downloadFile(caller: ItemDL) {

        let that = this;
     
        $.getScript(that.appWebUrl + "/_layouts/15/SP.RequestExecutor.js", function () {
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
                    url: that.appWebUrl + "/_api/SP.AppContextSite(@target)/web/GetFileByServerRelativeUrl('" + caller.srcUrl +"')/$value?@target='" + caller.parent.srcUrl + "'",
                    method: "GET",
                    binaryStringResponseBody:true,
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
  readFileToCopy(caller: ItemDL) {
     var targetLib = caller.parent.targetTitle;
     let that = this;

     var i;


     var ctx = SP.ClientContext.get_current();
      
  //  var factory = new SP.ProxyWebRequestExecutorFactory(this.appWebUrl);
  //  ctx.set_webRequestExecutorFactory(factory);
    
    var appContextSite = new SP.AppContextSite(ctx, caller.parent.srcUrl);
    var hostweb = appContextSite.get_web(); 
    var lists = hostweb.get_lists();
  
    ctx.load(hostweb);

    var file = hostweb.get_lists().getByTitle(caller.parent.title).getItemById(caller.id).get_file();
    var listItem = hostweb.get_lists().getByTitle(caller.parent.title).getItemById(caller.id);

    ctx.load(file);
    ctx.load(listItem);

    var counter = 1;
    return new Promise(function (resolve, reject) {
        ctx.executeQueryAsync(
            function () {

                //b console.log(caller.parent.title);
           
            // console.log(file);
            caller.name = file.get_name();
            caller.srcUrl = file.get_serverRelativeUrl();
            caller.title = file.get_title();
            caller.data1 = listItem.get_item("Data1");
            console.log("1:");
            console.log(caller.data1);

            resolve();

           // that.downloadFile(caller, file.get_serverRelativeUrl());
        },
            function () {
                reject(arguments[1].get_message());
            });
    });
      
}

  createFile(caller: ItemDL) {

      var targetList;
      var fileCreateInfo;
      var fileContent;
      let that = this;

      var ctx = SP.ClientContext.get_current();

      var appContextSite = new SP.AppContextSite(ctx, caller.parent.targetUrl).get_web();
      targetList = appContextSite.get_lists().getByTitle(caller.parent.targetTitle);

      fileCreateInfo = new SP.FileCreationInformation();
      fileCreateInfo.set_url(caller.name);
      fileCreateInfo.set_overwrite(true);
      fileCreateInfo.set_content(new SP.Base64EncodedByteArray());
      fileContent = caller.fileContent;

      for (var i = 0; i < fileContent.length; i++) {
          fileCreateInfo.get_content().append(fileContent.charCodeAt(i));
      }

      var newFile :SP.File = targetList.get_rootFolder().get_files().add(fileCreateInfo);
      ctx.load(newFile, 'ListItemAllFields');
/*
      var targetField = newFile.get_listItemAllFields["Data1"] as SP.Taxonomy.TaxonomyField;
      var listItem = newFile.get_listItemAllFields();

      ctx.load(listItem);
      ctx.load(targetField);*/

      return new Promise(function (resolve, reject) {
          ctx.executeQueryAsync(
              //Success
              function (data) {/*
                  targetField.setFieldValueByValueCollection(listItem, caller.data1);
                  listItem.update();
                  */
                  caller.targetId = newFile.get_listItemAllFields().get_id();

                  that.fillListItem(caller);

                  resolve();

              },
              //Fail
              function (data) {
                  reject(arguments[1].get_message());

              }


          );
      });



  }

  fillListItem(caller: ItemDL) {
     // var targetListItem: SP.ListItem;

      var termId = '<term guid>';
      var termLabel = '<term label>';

      var ctx = SP.ClientContext.get_current();
      console.log(caller.parent.targetTitle + " / " + caller.targetId);
      var appContextSite = new SP.AppContextSite(ctx, caller.parent.targetUrl).get_web();
     // targetListItem = appContextSite.get_lists().getByTitle(caller.parent.targetTitle).getItemById(caller.targetId);
      var targetList = appContextSite.get_lists().getByTitle(caller.parent.targetTitle);
      var targetItem = targetList.getItemById(caller.targetId);
      ctx.load(targetList);
      ctx.load(targetItem);
      var targetFieldt = (targetList.get_fields().getByInternalNameOrTitle("Data1") as SP.Taxonomy.TaxonomyField);

      // var targetFieldTax = ctx.castTo(targetField, SP.Taxonomy.TaxonomyField);
      var targetField = ctx.castTo(targetFieldt, SP.Taxonomy.TaxonomyField);

      console.log("2:");
      console.log(caller.data1);
     

      ctx.load(targetField);

      return new Promise(function (resolve, reject) {
          ctx.executeQueryAsync(
              //Success
              function (data) {

                  (targetField as SP.Taxonomy.TaxonomyField).setFieldValueByValueCollection(targetItem, caller.data1);
                  targetItem.update();
                  
                  
                 
           
             /*    
                  var x: any;
                  var taxVal = "";
                  for (x in caller.data1)
                  {
                      taxVal += x.Label + "|" + x.TermGuid+ ";";
                  }
                  targetField.populateFromLabelGuidPairs(taxVal);
                  targetListItem.update();*/
               //   targetField.setFieldValueByValueCollection(targetListItem, caller.data1);
                 // targetListItem.update();

      //            var targetValue = new SP.Taxonomy.TaxonomyFieldValue();
                

                  resolve();

              },
              //Fail
              function (data) {
                  reject(arguments[1].get_message());

              }


          );
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

    readFile(pathUrl: string) {
        var executor = new SP.RequestExecutor(this.appWebUrl);
        //var executor = new SP.RequestExecutor(pathUrl);
        let that = this;

        return new Promise(function (resolve, reject) {
            executor.executeAsync(
                {

                    url: that.appWebUrl + "/_api/SP.AppContextSite(@target)/web/GetFileByServerRelativeUrl('" + pathUrl + "')/Folders?@target='" + pathUrl + "'",
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