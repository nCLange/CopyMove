namespace BASF.SharePoint.ProFile.Copy
{
    using System;
    // using System.IO;
    using Microsoft.SharePoint.Client;
    //using Microsoft.SharePoint.ApplicationRuntime;
    using Microsoft.SharePoint.Client.Taxonomy;
    using Microsoft.SharePoint;
    // using System.Diagnostics;

    /// <summary>
    /// Implements the <see cref="ICopySoap" /> web-service, which is a clone of the
    /// original SharePoint "Copy.asmx" web-service.
    /// </summary>
    public class Copy
        : ICopySoap
    {
        /// <inheritdoc />
        public uint CopyIntoItems(string SourceUrl, string[] DestinationUrls, FieldInformation[] Fields, byte[] Stream, out CopyResult[] Results)
        {

            throw new NotSupportedException();
        }

        /// <inheritdoc />
        public uint CopyIntoItemsLocal(string SourceUrl, string[] DestinationUrls, out CopyResult[] Results)
        {
            Results = new CopyResult[DestinationUrls.Length];
            ;


            for (int i = 0; i < DestinationUrls.Length; i++)
            {
                Results[i] = new CopyResult();
                try
                {
                    AddFile(SourceUrl, DestinationUrls[i]);

                   
                    Results[i].ErrorCode = CopyErrorCode.Success;
                    Results[i].DestinationUrl = DestinationUrls[0];
                    Results[i].ErrorMessage = "Copied";
                }
                catch (Exception e)
                {
                    //e.Message
                    //   throw new Exception();
                    Results[i].ErrorCode = CopyErrorCode.Unknown;
                    Results[i].DestinationUrl = DestinationUrls[0];
                    Results[i].ErrorMessage = e.Message;
                }

   
            }

            return 0;

            //  pushFile(SourceUrl, bla[0],bla[1]);
            //


        }

        /// <inheritdoc />
        public uint GetItem(string Url, out FieldInformation[] Fields, out byte[] Stream)
        {


            throw new NotSupportedException();
        }

        public SPFile GetFile(string srcUrl)

        {

            SPSite mysite = new SPSite(srcUrl);
            SPWeb myweb = mysite.OpenWeb();
            // get the source list and items

            //   SPList targetWeb = myweb.Lists.TryGetList(srcTitle);

            return myweb.GetFile(srcUrl);

            //return null;
            /*
            // set up the src client

            string[] bla = srcUrl.Split('|'); 


            srcUrl = bla[0];

            string srcTitle = bla[1];

           // string srcFolder = bla[2];
           // if (srcFolder != "") srcFolder += "/";

            string srcId = bla[2];

            ClientContext srcContext = new ClientContext(srcUrl);
         
            // set up the destination context

          //  ClientContext destContext = new ClientContext(destUrl);


            // get the source list and items

            List srcWeb = srcContext.Web.Lists.GetByTitle(srcTitle);

            srcContext.Load(srcWeb);
            Console.WriteLine(srcWeb);
            //   List srcList = srcWeb.Lists.GetByTitle(srcLibrary);

            Microsoft.SharePoint.Client.File item = srcWeb.GetItemById(srcId).File;


            srcContext.Load(item);
            srcContext.ExecuteQuery();
            // get the destination list

            // Web destWeb = destContext.Web;

            //            destContext.Load(destWeb);


            //          destContext.ExecuteQuery();

            // Console.WriteLine(item.DisplayName);

            return item;
            */
        }

        //SSOM
        public void pushFile(string srcUrl, string destinationUrl, string destinationTitle)
        {

            SPSecurity.RunWithElevatedPrivileges(delegate
            {

                SPSite srcsite = new SPSite(srcUrl);
                SPWeb srcweb = srcsite.OpenWeb();

                SPFile srcItem = srcweb.GetFile(srcUrl);

                SPSite mysite = new SPSite(destinationUrl);
                SPWeb myweb = mysite.OpenWeb();

                SPList targetWeb = myweb.Lists.TryGetList(destinationTitle);

                using (System.IO.Stream stream = srcItem.OpenBinaryStream())
                {

                    targetWeb.RootFolder.Files.Add(srcItem.Name, stream);
                    stream.Close();

                }
            });

        }


        /*   public void SaveFile( string destUrl, string listUrl, string relativeItemUrl, byte[] fileData)
           {

               ClientContext context = new ClientContext(destUrl);

               using (System.IO.Stream stream = new System.IO.MemoryStream(fileData))
               {
                   var fci = new FileCreationInformation
                   {
                       Url = relativeItemUrl,
                       ContentStream = stream,
                       Overwrite = true
                   };


                   File file = context.Web.GetList("Dest3").RootFolder.Files.Add(fci);
                 //  Folder folder = context.Web.GetFolderByServerRelativeUrl(folderRelativeUrl);
                  // FileCollection files = folder.Files;
                  // File file = files.Add(fci);

                   //context.Load(files);
                   context.Load(file);
                   context.ExecuteQuery();
               }
           }*/


        /*
                public static void CopyFolderToAnotherSiteCollection(string sourceUrl, string destinationUrl,
                  string listName, string folderUrl, string folderName)
                {
                    string listRelatvieFolderUrl = folderUrl.Substring(folderUrl.IndexOf("/") + 1);
                    using (Site sourceSite = new Site(sourceUrl))
                    {
                        using (Web sourceWeb = sourceSite.OpenWeb())
                        {
                            SPFolder sourceFolder = sourceWeb.GetFolder(folderUrl);
                            using (SPSite destSite = new SPSite(destinationUrl))
                            {
                                using (SPWeb destWeb = destSite.OpenWeb())
                                {
                                    SPListItem destItem = destWeb.Lists[listName].Items.
                                        Add(string.Empty, SPFileSystemObjectType.Folder, listRelatvieFolderUrl);

                                    destItem.Update();

                                    SPFolder destFolder = destWeb.GetFolder(folderUrl);

                                    foreach (SPFile file in sourceFolder.Files)
                                    {
                                        destFolder.Files.Add(file.Url, file.OpenBinary());
                                    }

                                    foreach (SPFolder folder in sourceFolder.SubFolders)
                                    {
                                        CopyFolderToAnotherSiteCollection(sourceUrl, destinationUrl, listName,
                                            folder.Url, folder.Name);
                                    }

                                }
                            }
                        }
                    }
                }*/
        private void AddFile(string srcUrl, string targetUrl)
        {

            string[] split = srcUrl.Split('|');

            string clientAbsolute = split[0] + "/";
            string clientRelative = split[2];
            string clientTitle = split[1];

            split = targetUrl.Split('|');

            string targetAbsolute = split[0] + "/";
            string targetTitle = split[1];
            string targetRelative = split[2];


            var contentTuple = new System.Collections.Generic.List<System.Collections.Generic.List<object>>();

            ClientContext srcCtx = new ClientContext(clientAbsolute);
            ClientContext context = new ClientContext(targetAbsolute);
            Web web = srcCtx.Web;

            srcCtx.Load(web);
            srcCtx.ExecuteQuery();
            FieldCollection fieldCol = web.Lists.GetByTitle(clientTitle).Fields;
            File file = web.GetFileByServerRelativeUrl(web.ServerRelativeUrl + "/" + clientTitle + "/" + clientRelative);
            ListItem item = file.ListItemAllFields;

            srcCtx.Load(file);
            srcCtx.Load(item);
            srcCtx.Load(fieldCol);
            srcCtx.ExecuteQuery();

            for (int i = 0; i < fieldCol.Count; i++)
            {
                if (!fieldCol[i].FromBaseType && !fieldCol[i].Hidden)
                    contentTuple.Add(new System.Collections.Generic.List<object> { fieldCol[i].InternalName, fieldCol[i].TypeAsString });
            }

            foreach (System.Collections.Generic.List<object> tuple in contentTuple)
            {

                tuple.Add(item.FieldValues[tuple[0].ToString()]);
            }

            web = context.Web;
            context.Load(web);
            context.ExecuteQuery();

            using (System.IO.Stream fs = File.OpenBinaryDirect(context, file.ServerRelativeUrl).Stream)
            {
                File.SaveBinaryDirect(context, web.ServerRelativeUrl + "/" + targetTitle + "/" + targetRelative, fs, true);
                //  fs.Dispose();
            }

            file = web.GetFileByServerRelativeUrl(web.ServerRelativeUrl + "/" + targetTitle + "/" + targetRelative);
            item = file.ListItemAllFields;
            fieldCol = web.Lists.GetByTitle(targetTitle).Fields;

            context.Load(fieldCol);
            context.Load(file);
            context.Load(item);
            context.ExecuteQuery();

            foreach (System.Collections.Generic.List<object> tuple in contentTuple)
            {
                if (tuple[2] != null)
                {
                    if (tuple[1].ToString().Equals("TaxonomyFieldTypeMulti"))
                    {
                        var terms = new System.Collections.Generic.List<string>();

                        for (var i = 0; i < ((TaxonomyFieldValueCollection)tuple[2]).Count; i++)
                        {
                            terms.Add("-1;#" + ((TaxonomyFieldValueCollection)tuple[2])[i].Label + "|" + ((TaxonomyFieldValueCollection)tuple[2])[i].TermGuid);
                        }

                        Field field = fieldCol.GetByInternalNameOrTitle(tuple[0].ToString());
                        TaxonomyField txField = context.CastTo<TaxonomyField>(field);

                        var termValues = new TaxonomyFieldValueCollection(context, string.Join(";#", terms.ToArray()), txField);
                        txField.SetFieldValueByValueCollection(item, termValues);



                    }
                    else if (tuple[1].ToString().Equals("TaxonomyFieldType"))
                    {
                        var termValue = new TaxonomyFieldValue();
                        termValue.Label = ((TaxonomyFieldValue)tuple[2]).Label;
                        termValue.TermGuid = ((TaxonomyFieldValue)tuple[2]).TermGuid;
                        termValue.WssId = -1;
                        Field field = fieldCol.GetByInternalNameOrTitle(tuple[0].ToString());
                        TaxonomyField txField = context.CastTo<TaxonomyField>(field);
                        txField.SetFieldValueByValue(item, termValue);

                    }
                    else
                        item[tuple[0].ToString()] = tuple[2];
                }
            }
            item.Update();
            if (!(file.CheckOutType == CheckOutType.None)) file.CheckIn("Copied", CheckinType.MajorCheckIn);

            context.Load(item);
            context.Load(file);
            context.ExecuteQuery();


        }


        /*
                static private void CopyStream(System.IO.Stream source, System.IO.Stream destination)
                {
                    byte[] buffer = new byte[32768];
                    int bytesRead;
                    do
                    {
                        bytesRead = source.Read(buffer, 0, buffer.Length);
                        destination.Write(buffer, 0, bytesRead);
                    } while (bytesRead != 0);
                }

            }
            */
    }
}
