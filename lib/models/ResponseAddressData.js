"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseAddressData = void 0;
class ResponseAddressData {
    constructor(data) {
        this.town = data.Miejscowosc || '';
        this.zipCode = data.KodPocztowy || '';
        this.street = data.Ulica || '';
        this.houseNo = data.Budynek || '';
        this.doorNo = data.Lokal || '';
        this.post = data.Poczta || '';
        this.community = data.Gmina || '';
        this.county = data.Powiat || '';
        this.province = data.Wojewodztwo || '';
    }
}
exports.ResponseAddressData = ResponseAddressData;
