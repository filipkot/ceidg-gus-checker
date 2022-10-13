"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseData = void 0;
const html_entities_1 = require("html-entities");
const ResponseAddressData_1 = require("../models/ResponseAddressData");
const ResponseLegalForm_1 = require("../models/ResponseLegalForm");
class ResponseData {
    constructor(source, obj) {
        this.source = source.toLocaleUpperCase() || '';
        this.nip = obj.DanePodstawowe.NIP;
        this.regon = obj.DanePodstawowe.REGON;
        this.companyName = html_entities_1.XmlEntities.decode(obj.DanePodstawowe.Firma || '');
        this.startDate = obj.DaneDodatkowe.DataRozpoczeciaWykonywaniaDzialalnosciGospodarczej || '';
        this.endDate = obj.DaneDodatkowe.DataWykresleniaWpisuZRejestru || '';
        this.status = obj.DaneDodatkowe.Status || '';
        this.phone = obj.DaneKontaktowe.Telefon || '';
        this.email = obj.DaneKontaktowe.AdresPocztyElektronicznej || '';
        this.website = obj.DaneKontaktowe.AdresStronyInternetowej || '';
        this.pkd = obj.DaneDodatkowe.KodyPKD !== '' ? obj.DaneDodatkowe.KodyPKD.split(',') : [];
        this.legalForm = new ResponseLegalForm_1.ResponseLegalForm();
        this.legalForm.basic = obj.FormaPrawna.podstawowa;
        this.legalForm.specific = obj.FormaPrawna.szczegolna;
        this.businessAddress = new ResponseAddressData_1.ResponseAddressData(obj.DaneAdresowe.AdresGlownegoMiejscaWykonywaniaDzialalnosci);
        this.correspondenceAddress = new ResponseAddressData_1.ResponseAddressData(obj.DaneAdresowe.AdresDoDoreczen);
    }
}
exports.ResponseData = ResponseData;
