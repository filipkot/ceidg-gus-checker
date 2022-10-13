"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyDataCeidg = void 0;
const Response_1 = require("../viewModel/Response");
class CompanyDataCeidg {
    format(source) {
        if (source.toLowerCase() === 'ceidg') {
            this.FormaPrawna = {
                podstawowa: '9',
                szczegolna: '099',
            };
        }
        return new Response_1.ResponseData(source, this);
    }
}
exports.CompanyDataCeidg = CompanyDataCeidg;
