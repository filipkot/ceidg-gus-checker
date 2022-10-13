import { XmlEntities } from 'html-entities';
import { CompanyDataCeidg } from '../models/CompanyData';
import { ResponseAddressData } from '../models/ResponseAddressData';
import { ResponseLegalForm } from '../models/ResponseLegalForm';

export class ResponseData {
  public source: string;
  public nip: string;
  public regon: string;
  public companyName: string;
  public startDate: string;
  public endDate: string;
  public status: string;
  public phone: string;
  public email: string;
  public website: string;

  public businessAddress: ResponseAddressData;
  public correspondenceAddress: ResponseAddressData;
  public pkd: string[];
  public legalForm: ResponseLegalForm;

  constructor(source: string, obj: CompanyDataCeidg) {
    this.source = source.toLocaleUpperCase() || '';
    this.nip = obj.DanePodstawowe.NIP;
    this.regon = obj.DanePodstawowe.REGON;
    this.companyName = XmlEntities.decode(obj.DanePodstawowe.Firma || '');
    this.startDate = obj.DaneDodatkowe.DataRozpoczeciaWykonywaniaDzialalnosciGospodarczej || '';
    this.endDate = obj.DaneDodatkowe.DataWykresleniaWpisuZRejestru || '';
    this.status = obj.DaneDodatkowe.Status || '';
    this.phone = obj.DaneKontaktowe.Telefon || '';
    this.email = obj.DaneKontaktowe.AdresPocztyElektronicznej || '';
    this.website = obj.DaneKontaktowe.AdresStronyInternetowej || '';
    this.pkd = obj.DaneDodatkowe.KodyPKD !== '' ? obj.DaneDodatkowe.KodyPKD.split(',') : [];
    this.legalForm = new ResponseLegalForm();
    this.legalForm.basic = obj.FormaPrawna.podstawowa;
    this.legalForm.specific = obj.FormaPrawna.szczegolna;

    this.businessAddress = new ResponseAddressData(obj.DaneAdresowe.AdresGlownegoMiejscaWykonywaniaDzialalnosci);
    this.correspondenceAddress = new ResponseAddressData(obj.DaneAdresowe.AdresDoDoreczen);
  }
}


