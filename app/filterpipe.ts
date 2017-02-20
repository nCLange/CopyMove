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
    }
}