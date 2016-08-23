namespace BASF.SharePoint.ProFile.Copy
{
    using System;
    // using System.IO;
    using Microsoft.SharePoint.Client;
    //using Microsoft.SharePoint.ApplicationRuntime;
    using Microsoft.SharePoint.Client.Taxonomy;
    using Microsoft.SharePoint;
    using System.Collections.Generic;
    using System.Text;
    using System.Linq;
    using System.Globalization;

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
            if (string.IsNullOrEmpty(SourceUrl))
            {
                throw new ArgumentNullException(nameof(SourceUrl));
            }
            else if (DestinationUrls == null || DestinationUrls.Length == 0)
            {
                throw new ArgumentOutOfRangeException(nameof(DestinationUrls));
            }

            Results = new CopyResult[DestinationUrls.Length];
            for (int i = 0; i < DestinationUrls.Length; i++)
            {
                Results[i] = new CopyResult();
                try
                {
                    AddFileEx(SourceUrl, DestinationUrls[i]);
                    Results[i].ErrorCode = CopyErrorCode.Success;
                    Results[i].DestinationUrl = DestinationUrls[0];
                    Results[i].ErrorMessage = "Copied";
                }
                catch (Exception e)
                {
                    Results[i].ErrorCode = CopyErrorCode.Unknown;
                    Results[i].DestinationUrl = DestinationUrls[0];
                    Results[i].ErrorMessage = e.Message;

                    return 1;
                }
            }

            return 0;
        }

        /// <inheritdoc />
        public uint GetItem(string Url, out FieldInformation[] Fields, out byte[] Stream)
        {
            throw new NotSupportedException();
        }

        private static void AddFileEx(string sourceUrl, string destinationUrl)
        {
            using (ClientContext srcCtx = EstablishClientContext(sourceUrl))
            using (ClientContext context = EstablishClientContext(destinationUrl))
            {
                Uri sourceUri = new Uri(sourceUrl);
                Uri destinationUri = new Uri(destinationUrl);

                var contentTuple = new System.Collections.Generic.List<System.Collections.Generic.List<object>>();
                Web web = srcCtx.Web;
                File file = web.GetFileByServerRelativeUrl(sourceUri.PathAndQuery);
                FieldCollection fieldCol =  file.ListItemAllFields.ParentList.Fields;
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
                    File.SaveBinaryDirect(context, destinationUri.PathAndQuery, fs, true);
                    //  fs.Dispose();
                }

                file = web.GetFileByServerRelativeUrl(destinationUri.PathAndQuery);
                item = file.ListItemAllFields;
                fieldCol = item.ParentList.Fields;

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
        }

        private static ClientContext EstablishClientContext(string url)
        {
            string[] parts = url.Split('/');
            LinkedList<string> list = new LinkedList<string>();
            StringBuilder builder = new StringBuilder();
            foreach (string part in parts)
            {
                builder.Append(part);
                list.AddLast(builder.ToString());
                builder.Append('/');
            }

            foreach (string probeUrl in list.Reverse())
            {
                ClientContext context = null;
                try
                {
                    context = new ClientContext(probeUrl);
                    context.GetFormDigestDirect();
                    return context;
                }
                catch
                {
                    if (context != null)
                    {
                        context.Dispose();
                    }
                }
            }

            throw new InvalidOperationException(string.Format(CultureInfo.InvariantCulture, "Could not establish a connection to the URL '{0}'.", url));
        }

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
