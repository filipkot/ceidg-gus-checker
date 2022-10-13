import { ResponseData } from './viewModel/Response';
export declare class CompanyData {
    source: string;
    token: string;
    type: string;
    num: string;
    proxy: string;
    constructor(source: string, token: string, type: string, num: string, proxy: string);
    GetCompanyData(): Promise<ResponseData[]>;
}
