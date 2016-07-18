export class Directory {
    name: string;
    selected: boolean;
    directories: Array<Directory>;
    expanded: boolean;

    constructor(name) {
        this.name = name;
        this.selected = false;
       
        
    }
    getStyle() {
        if (this.selected) {
            return "yellow";
        } else {
            return "";
        }
    }

    toggle() {
        this.expanded = !this.expanded;
        if (this.expanded) {

        }
    }

}