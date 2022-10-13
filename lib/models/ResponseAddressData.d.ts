import { ICompanyDataCeidgAddressDetails } from "./CompanyData";
export declare class ResponseAddressData {
    town: string;
    zipCode: string;
    street: string;
    houseNo: string;
    doorNo: string;
    post: string;
    community: string;
    county: string;
    province: string;
    constructor(data: ICompanyDataCeidgAddressDetails);
}
