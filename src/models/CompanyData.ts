import { ResponseData } from '../viewModel/Response';
import { CompanyDataCeidgAddress } from './CompanyDataCeidgAddress';

export class CompanyDataCeidg {
  public IdentyfikatorWpisu: string;
  public DanePodstawowe: IDanePodstawowe;
  public DaneKontaktowe: any;
  public DaneAdresowe: CompanyDataCeidgAddress;
  public DaneDodatkowe: any;
  public FormaPrawna: IFormaPrawna;

  public format(source: string): ResponseData {
    if (source.toLowerCase() === 'ceidg') {
      this.FormaPrawna = {
        podstawowa: '9',
        szczegolna: '099',
      };
    }

    return new ResponseData(source, this);
  }
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
