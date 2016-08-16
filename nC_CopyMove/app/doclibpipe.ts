import {Injectable, Pipe} from 'angular2/core';
import {DocumentLibrary} from './documentlibrary';

@Pipe({
    name: 'DocLibFilter'
})
@Injectable()
export class DocLibPipe {

    transform(value, args?) {



        var dossierName = args;
        if (args == "" || args == null) return value;

        return value.filter(library => {
            if ((library as DocumentLibrary).name.toLowerCase().includes(dossierName.toLowerCase())) {
                library.expanded = true;

                return library;
            }
            else {
                library.expanded = false;
            }
        });

    }


}