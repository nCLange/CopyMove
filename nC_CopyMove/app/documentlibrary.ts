export class DocumentLibrary {
    name: string;
    path: string;
    selected: boolean;
    constructor(name, path="") {
        this.name = name;
        this.path = path;
        this.selected = false;
    }


    getStyle() {
        if (this.selected) {
            return "yellow";
        } else {
            return "";
        }
    }
}