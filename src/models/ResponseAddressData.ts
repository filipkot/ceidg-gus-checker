import { ICompanyDataCeidgAddressDetails } from "./CompanyData";

export class ResponseAddressData {
  public town: string;
  public zipCode: string;
  public street: string;
  public houseNo: string;
  public doorNo: string;
  public post: string;
  public community: string;
  public county: string;
  public province: string;

  constructor(data: ICompanyDataCeidgAddressDetails) {
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