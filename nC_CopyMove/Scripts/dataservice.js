System.register(['angular2/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var DataService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            let DataService = class DataService {
                getData() {
                    return [{
                            "id": 1,
                            "name": "Pizza Vegetaria",
                            "price": 5.99
                        }, {
                            "id": 2,
                            "name": "Pizza Salami",
                            "price": 10.99
                        }, {
                            "id": 3,
                            "name": "Pizza Thunfisch",
                            "price": 7.99
                        }, {
                            "id": 4,
                            "name": "Aktueller Flyer",
                            "price": 0
                        }];
                }
            };
            DataService = __decorate([
                core_1.Injectable(), 
                __metadata('design:paramtypes', [])
            ], DataService);
            exports_1("DataService", DataService);
        }
    }
});
//# sourceMappingURL=dataservice.js.map