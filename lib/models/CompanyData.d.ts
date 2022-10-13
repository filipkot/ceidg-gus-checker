import { ResponseData } from '../viewModel/Response';
import { CompanyDataCeidgAddress } from './CompanyDataCeidgAddress';
export declare class CompanyDataCeidg {
    IdentyfikatorWpisu: string;
    DanePodstawowe: IDanePodstawowe;
    DaneKontaktowe: any;
    DaneAdresowe: CompanyDataCeidgAddress;
    DaneDodatkowe: any;
    FormaPrawna: IFormaPrawna;
    format(source: string): ResponseData;
}
interface IFormaPrawna {
    podstawowa?: string;
    szczegolna?: string;
}
interface IDanePodstawowe {
    Imie?: string;
    Nazwisko?: string;
    NIP: string;
    REGON: string;
    Firma?: string;
}
export interface ICompanyDataCeidgAddressDetails {
    Miejscowosc: string;
    Ulica: string;
    Budynek: string;
    Lokal: string;
    KodPocztowy: string;
    Poczta: string;
    Gmina: string;
    Powiat: string;
    Wojewodztwo: string;
}
export {};
