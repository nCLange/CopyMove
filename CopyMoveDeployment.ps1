[CmdletBinding()]
param (
    [string]$SrcUrl = "http://win-iprrvsfootq/sites/dev",
    [string]$DocLibTitle  = "Site Assets",
    [string]$DocLibrelPath = "SiteAssets",
    [string]$SiteColFilter = "sites"
    
)

#Add-PSSnapin Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue

#dir -Path $PSScriptRoot -Filter "*.dll" | % {
 #   [System.Reflection.Assembly]::LoadFile($_.FullName)
  #  }

[System.Reflection.Assembly]::LoadWithPartialName("Microsoft.SharePoint.Client.Runtime")
[System.Reflection.Assembly]::LoadWithPartialName("Microsoft.SharePoint.Client")
[System.Reflection.Assembly]::LoadWithPartialName("Microsoft.Sharepoint.Client.Search")


$input = Read-Host 'Deploy on all Site collections? (Y)/(N)'

$context = New-Object Microsoft.SharePoint.Client.ClientContext $SrcUrl
$keywordQuery = New-Object Microsoft.SharePoint.Client.Search.Query.KeywordQuery($context)

$keywordQuery.QueryText = "contentclass:sts_site"
$keywordQuery.RowLimit=500
$keywordQuery.SourceId = "8413cd39-2156-4e00-b54d-11efd9abdb89"
Write-Host $keywordQuery.BlockDedupeMode
#$keywordQuery.Properties="Path"
$keywordQuery.TrimDuplicates= "fill"
$keywordQuery.TrimDuplicates= !$keywordQuery.TrimDuplicates
Write-Host $keywordQuery.TrimDuplicates.ToString()
$searchExec = New-Object Microsoft.SharePoint.Client.Search.Query.SearchExecutor($context)
$results = $searchExec.ExecuteQuery($keywordQuery)
$context.ExecuteQuery() 


foreach($result in $results.Value[0].ResultRows)

    {
    if($result["Path"] -notlike "*${SiteColFilter}*") { continue }

        $Url = $result["Path"]
        Write-Host $Url
    
        if($input.ToLower() -like 'n'){
            if($Url -notlike $SrcUrl){
                continue
            }
         }


<#$rootSite = New-Object Microsoft.SharePoint.SPSite($SrcUrl)
$spWebApp = $rootSite.WebApplication

foreach($site in $spWebApp.Sites)
{
    foreach($siteAdmin in $site.RootWeb.SiteAdministrators)
    {
        }
        else {
         if($siteAdmin.ParentWeb.Url -notlike '*profile*'){ continue}
        }

        Write-Host "$($siteAdmin.ParentWeb.Url) - $($siteAdmin.DisplayName)"
        $Url = $siteAdmin.ParentWeb.Url
        #>
        $VerbosePreference = "Continue"

        $context = New-Object Microsoft.SharePoint.Client.ClientContext $Url
        $web = $context.Web
        $context.Load($web)
        $lists = $web.Lists
        $context.Load($lists)
        $context.ExecuteQuery()


        #Add docbib

        $docBib = $null
        $docBib = $web.Lists | where{ $_.Title -eq $DocLibTitle}

       if($docBib)
        {   
            $library = $docBib
        }
        else 
        {
        
        $listTemplate = [Microsoft.SharePoint.SPListTemplateType]::DocumentLibrary
        $ListCreationInfo = New-Object Microsoft.SharePoint.Client.ListCreationInformation
        $ListCreationInfo.Title = “Site Assets”
        $ListCreationInfo.TemplateType = $listTemplate
        $library = $web.Lists.Add($ListCreationInfo)

        $context.Load($library)
        $context.ExecuteQuery() 

        }
 

        $generalFolder = $library.RootFolder.Folders.Add('CopyMove')
        $context.Load($generalFolder)
        $context.ExecuteQuery()

        $scriptsfolder = $generalFolder.Folders.Add('scripts')
        $context.Load($scriptsfolder)
        $context.ExecuteQuery()

        $pagesfolder = $generalFolder.Folders.Add('pages')
        $context.Load($pagesfolder)
        $context.ExecuteQuery()

        $libfolder = $generalFolder.Folders.Add('libs')
        $context.Load($libfolder)
        $context.ExecuteQuery()

        $imagefolder = $generalFolder.Folders.Add('images')
        $context.Load($imagefolder)
        $context.ExecuteQuery()

        $stylefolder = $generalFolder.Folders.Add('styles')
        $context.Load($stylefolder)
        $context.ExecuteQuery()

        ##Add Files to Docbib

        $scriptsLocation  = "$PSScriptRoot\Scripts"

        $scripts = ([System.IO.DirectoryInfo] (Get-Item $scriptsLocation)).GetFiles()

        Foreach ($script in $scripts) {

            Write-Host "Uploading file.." -ForegroundColor Green
            $FileFullName = $script.FullName
            $FileStream1 = New-Object IO.FileStream($FileFullName, [System.IO.FileMode]::Open)
            $FileCreationInfo = New-Object Microsoft.SharePoint.Client.FileCreationInformation
            $FileCreationInfo.Overwrite = $true
            $FileCreationInfo.ContentStream = $FileStream1
            $FileCreationInfo.URL = $script.Name
            $FileUpload = $scriptsfolder.Files.Add($FileCreationInfo)
            $context.Load($FileUpload)
            $context.ExecuteQuery()
            $FileStream1.Dispose()
        }

        $pagesLocation  = "$PSScriptRoot\Pages"

        $pages = ([System.IO.DirectoryInfo] (Get-Item $pagesLocation)).GetFiles()

        Foreach ($page in $pages) {

            Write-Host "Uploading file.." -ForegroundColor Green
            $FileFullName = $page.FullName
            $FileStream2 = New-Object IO.FileStream($FileFullName, [System.IO.FileMode]::Open)
            $FileCreationInfo = New-Object Microsoft.SharePoint.Client.FileCreationInformation
            $FileCreationInfo.Overwrite = $true
            $FileCreationInfo.ContentStream = $FileStream2
            $FileCreationInfo.URL = $page.Name
            $FileUpload = $pagesfolder.Files.Add($FileCreationInfo)
            $context.Load($FileUpload)
            $context.ExecuteQuery()
            $FileStream2.Dispose()
        }
 

        $libLocation  = "$PSScriptRoot\libs"

        $libs = ([System.IO.DirectoryInfo] (Get-Item $libLocation)).GetFiles()

        Foreach ($lib in $libs) {

            Write-Host "Uploading file.." -ForegroundColor Green
            $FileFullName = $lib.FullName
            $FileStream1 = New-Object IO.FileStream($FileFullName, [System.IO.FileMode]::Open)
            $FileCreationInfo = New-Object Microsoft.SharePoint.Client.FileCreationInformation
            $FileCreationInfo.Overwrite = $true
            $FileCreationInfo.ContentStream = $FileStream1
            $FileCreationInfo.URL = $lib.Name
            $FileUpload = $libfolder.Files.Add($FileCreationInfo)
            $context.Load($FileUpload)
            $context.ExecuteQuery()
            $FileStream1.Dispose()
        }

        $styleLocation  = "$PSScriptRoot\styles"

        $styles = ([System.IO.DirectoryInfo] (Get-Item $styleLocation)).GetFiles()

        Foreach ($style in $styles) {

            Write-Host "Uploading file.." -ForegroundColor Green
            $FileFullName = $style.FullName
            $FileStream1 = New-Object IO.FileStream($FileFullName, [System.IO.FileMode]::Open)
            $FileCreationInfo = New-Object Microsoft.SharePoint.Client.FileCreationInformation
            $FileCreationInfo.Overwrite = $true
            $FileCreationInfo.ContentStream = $FileStream1
            $FileCreationInfo.URL = $style.Name
            $FileUpload = $stylefolder.Files.Add($FileCreationInfo)
            $context.Load($FileUpload)
            $context.ExecuteQuery()
            $FileStream1.Dispose()
        }

        $imagesLocation  = "$PSScriptRoot\images"

        $images = ([System.IO.DirectoryInfo] (Get-Item $imagesLocation)).GetFiles()

        Foreach ($image in $images) {

            Write-Host "Uploading file.." -ForegroundColor Green
            $FileFullName = $image.FullName
            $FileStream2 = New-Object IO.FileStream($FileFullName, [System.IO.FileMode]::Open)
            $FileCreationInfo = New-Object Microsoft.SharePoint.Client.FileCreationInformation
            $FileCreationInfo.Overwrite = $true
            $FileCreationInfo.ContentStream = $FileStream2
            $FileCreationInfo.URL = $image.Name
            $FileUpload = $imagefolder.Files.Add($FileCreationInfo)
            $context.Load($FileUpload)
            $context.ExecuteQuery()
            $FileStream2.Dispose()
        }
 



        $userActions = $context.web.UserCustomActions  
        $context.Load($userActions)   
        $context.ExecuteQuery()   
 
 
         $itemsToDelete = @()  
            if($userActions.Count -le 0){  
                Write-Host "No Ribbon Items found to delete"  
            }  
            else{  
            foreach($userAction in $userActions){  
                $itemsToDelete += $userAction                  
            }  
            foreach($item in $itemsToDelete){  
                Write-Host "Deleting Ribbon Item : " $item.Title  
                $item.DeleteObject()  
            }  
            $context.ExecuteQuery()  
        }  
 
 
 
 
 
 
 
        $action = $context.Web.UserCustomActions.Add();
        $action.RegistrationType = "List";
        $action.RegistrationId = "101"; 
        $action.Location = "CommandUI.Ribbon";
 
        $action.Sequence = 1;
 
        $cUIExtn = "<CommandUIExtension>
                        <CommandUIDefinitions>
                            <CommandUIDefinition Location=""Ribbon.Documents.New.Controls._children"">
                                <Button Id=""Ribbon.List.Share.GetItemsCountButton"" 
                                 Alt="""" 
                                 Sequence=""900""
                                 Command=""CopyMove"" 
                                 LabelText=""Copy Move"" 
                                 TemplateAlias=""o1"" 
                                 Image32by32=""_layouts/15/images/rtrsendtoicon.png"" 
                                 Image16by16=""_layouts/15/images/placeholder16x16.png"" />
                             </CommandUIDefinition></CommandUIDefinitions>
                           <CommandUIHandlers>
                            <CommandUIHandler 
                             Command=""CopyMove""
                             EnabledScript=""javascript:SP.ListOperation.Selection.getSelectedItems().length>0;""  
                             CommandAction=""javascript: var options = {
                                                        title: 'Copy or Move content',
                                                        width: 700,
                                                        height: 400,
                                                        showClose: false,
                                                        url: '${Url}/${DocLibrelPath}/CopyMove/pages/Default.aspx?SPListId={SelectedListId}&amp;SPListURL={Source}&amp;SPListItemId={SelectedItemId}'};
                             SP.UI.ModalDialog.showModalDialog(options);
                             ""/>
                             </CommandUIHandlers>
                     </CommandUIExtension>";



         $action.set_commandUIExtension($cUIExtn);
         $action.update();
         $context.Load($action)
         $context.ExecuteQuery()
         $context.dispose();

         }
<#
   }
    $site.Dispose()
}#>