
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

    constructor() {


        // this.webAppURL = "http://win-iprrvsfootq";
        // this.hostWebUrl = decodeURIComponent(this.getQueryStringParameter('SPHostUrl'));
        this.hostWebUrl = "http://win-iprrvsfootq/sites/dev";
        this.appWebUrl = _spPageContextInfo.webAbsoluteUrl;
        // this.siteURL = _spPageContextInfo.webAbsoluteUrl;
        console.log("Host Web is: " + this.hostWebUrl + "\n AppWebUrl is: " + this.appWebUrl);
        //this.getDocLib();
        //this.getSiteCollections();
        // this.getDocumentLibraries();
        this.doJSOMStuff(this.hostWebUrl);
        this.doRESTStuff(this.hostWebUrl);
    }

    doRESTStuff(siteURL) {
        var executor = new SP.RequestExecutor(this.appWebUrl);

        executor.executeAsync(
            {
                //url: this.appWebUrl + "/_api/SP.AppContextSite(@target)/web/title?@target='" + siteURL + "'",
                // url: this.appWebUrl + "/_api/SP.AppContextSite(@target)/search/query?querytext='contentclass:sts_site'&@target='" + siteURL + "'",
                url: this.appWebUrl + "/_api/search/query?querytext='contentclass:sts_site'",

                method: "GET",
                headers: { "Accept": "application/json; odata=verbose" },
                success: function (data) {
                    var myoutput = JSON.parse(JSON.stringify(data.body));
                    console.log(myoutput);
                },
                error: function (data) {
                    console.log(JSON.stringify(data));
                }


            }
        );

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
        console.log('Request failed ' + args.get_message()+ '\n'+args.get_stackTrace());
    }

    onQuerySuceeded(sender, args) {
        console.log('Title' + this.oWebSite.get_title());
    }

    getDocLib() {

        this.queryText = 'contentclass:sts_site';
        
        var url = this.appWebUrl + "/_api/SP.AppContextSite(@target)/web/lists?&@target='"+this.hostWebUrl+"'";
        //var executor = new SP.RequestExecutor(_spPageContextInfo.webAbsoluteUrl);
        var executor = new SP.RequestExecutor(this.appWebUrl);
        executor.executeAsync({
            url: url,
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                console.log("Data: Site Col");
                var myoutput = JSON.parse(JSON.stringify(data.body));
                console.log(myoutput);
            },
            error: function (data) {
                console.log("Error: Site Col");
                console.log(JSON.stringify(data));
            }
        });


    }

    getSiteCollections() {


        this.queryText = 'contentclass:sts_site';
        /*
        //var url = this.appWebUrl + "/_api/SP.AppContextSite(@target)/search/query?querytext='" + queryText + "'&@target='"+this.hostWebUrl+"'";
        var url = this.appWebUrl + "/_api/search/query?querytext='" + queryText + "'";
        console.log("SiteColQueryURL: " + url);
        //var executor = new SP.RequestExecutor(_spPageContextInfo.webAbsoluteUrl);
        var executor = new SP.RequestExecutor(this.appWebUrl);
        executor.executeAsync({
            url: url,
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                console.log("Data: Site Col");
                var myoutput = JSON.parse(JSON.stringify(data.body));
                console.log(myoutput);
            },
            error: function (data) {
                console.log("Error: Site Col");
                console.log(JSON.stringify(data));
            }
        });
       
    */


/*XMLHttpRequest cannot load http://win-iprrvsfootq/sites/dev/_api/search/query?querytext=%27contentclass:sts_site%27. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://app-e7c2da331e0246.app.labs.novasolutions.local' is therefore not allowed access. The response had HTTP status code 401
        */
    $.ajax({
        url: "http://win-iprrvsfootq/sites/dev/_api/search/query?querytext='contentclass:sts_site'",
        method: "GET",
        headers: {
            "accept": "application/json; odata=verbose",
        },
        success: function (data) {
            console.log("Data: Site Col");
            var myoutput = JSON.parse(JSON.stringify(data));
            console.log(myoutput);

        },
        error: function (data) {
            console.log("Error: Site Col");
            console.log(JSON.stringify(data));

        }

    });

}

    getDocumentLibraries() {

        var queryText = 'contentclass:sts_list_documentlibrary';
        var url = this.siteURL + "/_api/search/query?querytext='" + queryText + "'";
        var executor = new SP.RequestExecutor(_spPageContextInfo.webAbsoluteUrl);
        executor.executeAsync({
            url: url,
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                console.log("Data: DocumentLibraries");
                var myoutput = JSON.parse(JSON.stringify(data));
                console.log(myoutput);
            },
            error: function (data) {
                console.log("Error: DocumentLibraries");
                console.log(JSON.stringify(data));
            }
        });

    }

    getQueryStringParameter(paramToRetrieve) {
        var params =
            document.URL.split("?")[1].split("&");
        var strParams = "";
        for (var i = 0; i < params.length; i = i + 1) {
            var singleParam = params[i].split("=");
            if (singleParam[0] == paramToRetrieve)
                return singleParam[1];
        }
    }
}