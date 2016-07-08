export class DocumentLibrary {
    name: string;
    selected: boolean;
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
}