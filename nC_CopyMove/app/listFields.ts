


export class ListField{
    name: string;
    type : string;
    allowed: boolean;
  //  content : any;

    constructor(name,type){
        this.name = name;
        this.type = type;


        switch(type){

            case "User":
            case "Lookup":
            case "URL":
                this.allowed=false;
                break;

            default:
                this.allowed = true;
  
        }

    }

}