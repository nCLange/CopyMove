


export class ListField{
    name: string;
    type : string;
    allowed: boolean;
  //  content : any;

    constructor(name,type){
        this.name = name;
        this.type = type;

        console.log(this.name+ "//" + this.type);

        switch(type){

            case "User":
            case "Lookup":
                this.allowed=false;
                break;

            default:
                this.allowed = true;
  
        }

    }

}