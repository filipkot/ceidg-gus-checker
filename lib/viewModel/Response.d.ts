import { CompanyDataCeidg } from '../models/CompanyData';
import { ResponseAddressData } from '../models/ResponseAddressData';
import { ResponseLegalForm } from '../models/ResponseLegalForm';
export declare class ResponseData {
    source: string;
    nip: string;
    regon: string;
    companyName: string;
    startDate: string;
    endDate: string;
    status: string;
    phone: string;
    email: string;
    website: string;
    businessAddress: ResponseAddressData;
    correspondenceAddress: ResponseAddressData;
    pkd: string[];
    legalForm: ResponseLegalForm;
    constructor(source: string, obj: CompanyDataCeidg);
}
