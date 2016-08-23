import {Injectable, Pipe} from '@angular/core';
import {SiteCollection} from './sitecollection';

@Pipe({
    name: 'SiteColFilter'
})
@Injectable()
export class SiteColPipe {

    transform(value, args?) {

        var dossierName = args;
        if (args == null) return value;
 
        return value.filter(site => {
            (site as SiteCollection).expanded = false;
            (site as SiteCollection).visible=false;

            if(dossierName.length<3){
                (site as SiteCollection).visible=true;
                (site as SiteCollection).expanded=false;
                return site;
            }
            
            for (var i = 0; i < (site as SiteCollection).documentLibraries.length; i++) {
                //console.log((site as SiteCollection).documentLibraries[i].name+"---"+dossierName);
                if ((site as SiteCollection).documentLibraries[i].name.toLowerCase().includes(dossierName.toLowerCase())) {
                    (site as SiteCollection).documentLibraries[i].visible = true;
                    if(dossierName!="")
                        (site as SiteCollection).expanded = true;
                    (site as SiteCollection).visible=true;
                }
                else {
                    (site as SiteCollection).documentLibraries[i].visible = false;
                }
            }
            if ((site as SiteCollection).visible == true)
                return site;
        });

    }


}