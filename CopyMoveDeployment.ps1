[CmdletBinding()]
param (
    [Parameter(Mandatory = $false)][string]$Url = "http://win-iprrvsfootq/sites/dev/"
)

Add-PSSnapin Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue

[System.Reflection.Assembly]::LoadWithPartialName("Microsoft.SharePoint.Client.Runtime")
[System.Reflection.Assembly]::LoadWithPartialName("Microsoft.SharePoint.Client")

$VerbosePreference = "Continue"

$context = New-Object Microsoft.SharePoint.Client.ClientContext $Url
$web = $context.Web
$context.Load($web)
$context.ExecuteQuery()


#Add docbib

$docBib = $web.Lists.GetByTitle(“CopyMove”);
$context.Load($docBib);
$context.ExecuteQuery();

if($docBib -ne $null)
{
    $docBib.DeleteObject();
    $context.ExecuteQuery();
}

$listTemplate = [Microsoft.SharePoint.SPListTemplateType]::DocumentLibrary
$ListCreationInfo = New-Object Microsoft.SharePoint.Client.ListCreationInformation
$ListCreationInfo.Title = “CopyMove”
$ListCreationInfo.TemplateType = $listTemplate
$library = $web.Lists.Add($ListCreationInfo)


$context.Load($library)
$context.ExecuteQuery()

$scriptsfolder = $library.RootFolder.Folders.Add('scripts')
$context.Load($scriptsfolder)
$context.ExecuteQuery()

$pagesfolder = $library.RootFolder.Folders.Add('pages')
$context.Load($pagesfolder)
$context.ExecuteQuery()

$libfolder = $library.RootFolder.Folders.Add('libs')
$context.Load($libfolder)
$context.ExecuteQuery()

$stylefolder = $library.RootFolder.Folders.Add('styles')
$context.Load($stylefolder)
$context.ExecuteQuery()

##Add Files to Docbib

$scriptsLocation  = "$PSScriptRoot\gitPush\nC_CopyMove\Scripts"

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

$pagesLocation  = "$PSScriptRoot\gitPush\nC_CopyMove\Pages"

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
 

$libLocation  = "$PSScriptRoot\gitPush\nC_CopyMove\libs"

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

$styleLocation  = "$PSScriptRoot\gitPush\nC_CopyMove\styles"

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
                                                url: 'http://win-iprrvsfootq/sites/dev/CopyMove/pages/Default.aspx?SPListId={SelectedListId}&amp;SPListURL={Source}&amp;SPListItemId={SelectedItemId}'};
                     SP.UI.ModalDialog.showModalDialog(options);
                     ""/>
                     </CommandUIHandlers>
             </CommandUIExtension>";



 $action.set_commandUIExtension($cUIExtn);
 $action.update();
  $context.Load($action)
  $context.ExecuteQuery()
$context.dispose();