import {Injectable, Pipe} from '@angular/core';
import {SiteCollection} from './sitecollection';
import {DataService} from './dataservice';

@Pipe({
    name: 'SiteColFilter'
})
@Injectable()
export class SiteColPipe {

    private dataService: DataService;

    constructor() {

        this.dataService = new DataService();
    }

    transform(value, args?) {

        var dossierName = args;
        if (args == null) return value;

        //NEW
        if (dossierName.length < 3)
            return value;

      /*  this.dataService.searchDocLibFilter(this,dossierName).then(
            response => { },
            response => { }
        )*/

      //  this.dataService.searchDocLibFilterObservable(this,dossierName);



        /*  return value.filter(site => {
              (site as SiteCollection).expanded = false;
              (site as SiteCollection).visible = false;
  
              if (dossierName.length < 3) {
                  (site as SiteCollection).visible = true;
                  (site as SiteCollection).expanded = false;
              }
              
              for (var i = 0; i < (site as SiteCollection).documentLibraries.length; i++) {
                  if (dossierName.length < 3) {
                      (site as SiteCollection).documentLibraries[i].visible = true;
                      continue;
                  }
                  //console.log((site as SiteCollection).documentLibraries[i].name+"---"+dossierName);
                  if ((site as SiteCollection).documentLibraries[i].title.toLowerCase().includes(dossierName.toLowerCase())) {
                      (site as SiteCollection).documentLibraries[i].visible = true;
                      if (dossierName != "")
                          (site as SiteCollection).expanded = true;
                      (site as SiteCollection).visible = true;
                  }
                  else {
                      (site as SiteCollection).documentLibraries[i].visible = false;
                  }
              }
              
             // if ((site as SiteCollection).visible == true)
                  return site;
          });*/
    }


}