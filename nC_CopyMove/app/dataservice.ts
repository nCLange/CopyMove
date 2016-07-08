﻿import {Injectable} from 'angular2/core';

@Injectable()
export class DataService {
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
            }]
    }
}