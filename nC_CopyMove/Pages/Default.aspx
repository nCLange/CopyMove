<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>


   
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
     <WebPartPages:AllowFraming runat="server" />
    <script type="text/javascript" src="/_layouts/15/sp.RequestExecutor.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
    <script type="text/javascript" src="//ajax.aspnetcdn.com/ajax/4.0/1/MicrosoftAjax.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/es6-shim/0.34.1/es6-shim.js"></script>
  
    <script src="https://code.jquery.com/jquery-3.0.0.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/0.19.16/system-polyfills.js"></script>
    <script src="https://code.angularjs.org/2.0.0-beta.17/angular2-polyfills.js"></script>
    <script src="https://code.angularjs.org/tools/system.js"></script>
    <script src="https://code.angularjs.org/2.0.0-beta.17/Rx.js"></script>
    <script src="https://code.angularjs.org/2.0.0-beta.17/angular2.dev.js"></script>
    <script src="https://code.angularjs.org/2.0.0-beta.17/http.dev.js"></script>
    <script src="https://code.angularjs.org/2.0.0-beta.17/router.dev.js"></script>
    <script src="https://code.angularjs.org/2.0.0-beta.17/upgrade.js"></script>
   
   
    <script>
        System.config({
            packages: {
                '../scripts': {
                    format: 'register',
                    defaultExtension: 'js'
                }
            }
        });
        System.import('../scripts/boot')
              .then(null, console.error.bind(console));
    </script>
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
     <WebPartPages:AllowFraming runat="server" />
    Page Title
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
     <WebPartPages:AllowFraming runat="server" />


 <app-main></app-main>

</asp:Content>
