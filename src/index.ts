import { CompanyDataCeidg } from './models/CompanyData';
import { ResponseData } from './viewModel/Response';

const request = require('request');
const parser = require('fast-xml-parser');
const decode = require('unescape');

const urlCeidg = 'https://dane.biznes.gov.pl';
const urlGus = 'https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc';

// export const Greeter = (name: string) => `Hello ${name}`;

export class CompanyData {
  public source: string;
  public token: string;
  public type: string;
  public num: string;
  public proxy: string;

  constructor(source: string, token: string, type: string, num: string, proxy: string) {
    this.source = source;
    this.token = token;
    this.type = type;
    this.num = num;
    this.proxy = proxy;
  }

  public async GetCompanyData(): Promise<ResponseData[]> {
    return new Promise(async (resolve, reject) => {
      if (this.source.toLocaleUpperCase() === 'CEIDG') {
        const data: ResponseData[] = [];
        try {
          const model = await GetDataFromNewCeidg(this.num, this.token, this.proxy);
  
          data.push(model);
          return resolve(data);
        } catch (error) {
          return resolve(data);
        }
      } else if (this.source.toLocaleUpperCase() === 'GUS') {
        const gusSid = await generateGusSid(this.token, this.proxy);
        let regon: string = '';
  
        if (this.type.toLocaleLowerCase() === 'nip') {
          this.type = 'Nip';
          regon = await findGusData(gusSid, this.type, this.num, this.proxy);
        } else {
          regon = this.num;
        }
  
        const myObj: ResponseData[] = await findGusFullReport(gusSid, regon, this.proxy, 'BIR11OsPrawna');
        return resolve(myObj);
      }
    });
  }
}


async function GetDataFromNewCeidg(nip: string, token: string, proxy: string): Promise<ResponseData> {
  return new Promise((resolve, reject) => {
    const options = {
      ...(proxy !== undefined && {proxy: `${proxy}`}),
      url: `${urlCeidg}/api/ceidg/v2/firma?nip=${nip}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      request(options, (error: any, response: any) => {

        if (error) { throw new Error(error) };

        if (response.statusCode === 200) {
          const jsonObjX = JSON.parse(response.body);
          let jsonObj = jsonObjX.firma.find((myObj: any) => {
            return myObj.status.toLocaleLowerCase() === 'aktywny';
          });

          if (jsonObj === undefined) {
            jsonObj = jsonObjX.firma[0];
          }

          const model: CompanyDataCeidg = new CompanyDataCeidg();

          model.DanePodstawowe = {
            Firma: jsonObj.nazwa,
            Imie: jsonObj.wlasciciel.imie,
            Nazwisko: jsonObj.wlasciciel.nazwisko,
            NIP: jsonObj.wlasciciel.nip,
            REGON: jsonObj.wlasciciel.regon,
          };

          model.DaneAdresowe = {
            AdresGlownegoMiejscaWykonywaniaDzialalnosci: {
              Miejscowosc: jsonObj.adresDzialalnosci.miasto || '',
              Ulica: jsonObj.adresDzialalnosci.ulica || '',
              Budynek: jsonObj.adresDzialalnosci.budynek || '',
              Lokal: jsonObj.adresDzialalnosci.lokal || '',
              KodPocztowy: jsonObj.adresDzialalnosci.kod || '',
              Poczta: jsonObj.adresDzialalnosci.poczta || '',
              Gmina: jsonObj.adresDzialalnosci.gmina || '',
              Powiat: jsonObj.adresDzialalnosci.powiat || '',
              Wojewodztwo: jsonObj.adresDzialalnosci.wojewodztwo || '',
            },
            AdresDoDoreczen: {
              Miejscowosc: jsonObj.adresKorespondencyjny.miasto || '',
              Ulica: jsonObj.adresKorespondencyjny.ulica || '',
              Budynek: jsonObj.adresKorespondencyjny.budynek || '',
              Lokal: jsonObj.adresKorespondencyjny.lokal || '',
              KodPocztowy: jsonObj.adresKorespondencyjny.kod || '',
              Poczta: jsonObj.adresKorespondencyjny.poczta || '',
              Gmina: jsonObj.adresKorespondencyjny.gmina || '',
              Powiat: jsonObj.adresKorespondencyjny.powiat || '',
              Wojewodztwo: jsonObj.adresKorespondencyjny.wojewodztwo || '',
            },
          };

          let kodypkd: string = '';

          jsonObj.pkd.forEach((element: string) => {
            kodypkd += kodypkd === '' ? element : `,${element}`;
          });

          model.DaneDodatkowe = {
            DataRozpoczeciaWykonywaniaDzialalnosciGospodarczej: jsonObj.dataRozpoczecia || '',
            DataWykresleniaWpisuZRejestru: jsonObj.dataWykreslenia || '',
            Status: jsonObj.status || '',
            KodyPKD: kodypkd,
          };

          model.DaneKontaktowe = {
            Telefon: jsonObj.telefon || '',
            AdresPocztyElektronicznej: jsonObj.email || '',
            AdresStronyInternetowej: jsonObj.www || '',
          };

          model.FormaPrawna = {
            podstawowa: '',
            szczegolna: '',
          };

          const retObj: ResponseData = new ResponseData('CEIDG', model);
          return resolve(retObj);
        } else {
          reject(error);
        }
      });
    } catch (error) {
      return reject(error);
    }
  });
}

async function generateGusSid(apiKey: string, proxy: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const xml = `
      <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://CIS/BIR/PUBL/2014/07" xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://www.w3.org/2005/08/addressing">
        <soap:Header>
          <a:Action s:mustUnderstand="1">http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/Zaloguj</a:Action>
          <a:To s:mustUnderstand="1">https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc</a:To>
        </soap:Header>
        <soap:Body>
          <ns:Zaloguj xmlns="http://CIS/BIR/PUBL/2014/07">
            <ns:pKluczUzytkownika>${apiKey}</ns:pKluczUzytkownika>
          </ns:Zaloguj>
        </soap:Body>
      </soap:Envelope>
      `;

    const options = {
      ...(proxy !== undefined && {proxy: `${proxy}`}),
      method: 'POST',
      url: urlGus,
      headers: {
        'Content-Type': 'application/soap+xml;charset=UTF-8',
      },
      secureProtocol: 'TLSv1_2_method',
      body: xml,
    };

    try {
      request(options, (error: any, response: any) => {
        if (error) { throw new Error(error) };

        try {
          const jsonObj = parser.parse(response.body, {});
          const jsonObj2 = jsonObj[Object.keys(jsonObj)[0]];
          const jsonObj3 = jsonObj2[Object.keys(jsonObj2)[1]];
          const gusSid = jsonObj3[Object.keys(jsonObj3)[1]].ZalogujResponse.ZalogujResult;
          return resolve(gusSid);
        } catch (error) {
          console.error(`Error when logging into GUS! \nBody: ${response.body}`);
          throw error;
        }
        
      });
    } catch (error) {
      return reject(error);
    }
  });
}

async function findGusData(sid: string, type: string, num: string, proxy: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const xml = `
      <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://CIS/BIR/PUBL/2014/07" xmlns:dat="http://CIS/BIR/PUBL/2014/07/DataContract">
        <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
          <wsa:Action>http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/DaneSzukajPodmioty</wsa:Action>
          <wsa:To>https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc</wsa:To>
        </soap:Header>
        <soap:Body>
            <ns:DaneSzukajPodmioty>
                <ns:pParametryWyszukiwania>
                  <dat:${type}>${num}</dat:${type}>
                </ns:pParametryWyszukiwania>
            </ns:DaneSzukajPodmioty>
        </soap:Body>
      </soap:Envelope>`;

    const options = {
      ...(proxy !== undefined && {proxy: `${proxy}`}),
      method: 'POST',
      url: urlGus,
      headers: {
        'Content-Type': 'application/soap+xml',
        sid: `${sid}`,
      },
      secureProtocol: 'TLSv1_2_method',
      body: xml,
    };

    try {
      request(options, (error: any, response: any) => {
        if (error) { throw new Error(error) };
        const jsonObj = parser.parse(response.body, {});
        const jsonObj2 = jsonObj[Object.keys(jsonObj)[0]];
        const jsonObj3 = jsonObj2[Object.keys(jsonObj2)[1]];
        const test = jsonObj3[Object.keys(jsonObj3)[1]].DaneSzukajPodmiotyResponse.DaneSzukajPodmiotyResult;
        const jsonObjX = parser.parse(decode(test), { parseNodeValue: false });
        return resolve(type.toLocaleLowerCase() === 'regon' ? num : jsonObjX.root.dane.Regon);
      });
    } catch (error) {
      return reject(error);
    }
  });
}

async function findGusFullReport(
  sid: string,
  regon: string,
  proxy: string,
  reportName: string,
): Promise<ResponseData[]> {
  return new Promise((resolve, reject) => {
    const xml = `
          <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://CIS/BIR/PUBL/2014/07">
            <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
              <wsa:Action>http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/DanePobierzPelnyRaport</wsa:Action>
              <wsa:To>https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc</wsa:To>
            </soap:Header>
            <soap:Body>
                <ns:DanePobierzPelnyRaport>
                  <ns:pRegon>${regon}</ns:pRegon>
                  <ns:pNazwaRaportu>${reportName}</ns:pNazwaRaportu>
                </ns:DanePobierzPelnyRaport>
            </soap:Body>
          </soap:Envelope>`;

    const options = {
      ...(proxy !== undefined && {proxy: `${proxy}`}),
      method: 'POST',
      url: urlGus,
      headers: {
        'Content-Type': 'application/soap+xml',
        sid: `${sid}`,
      },
      secureProtocol: 'TLSv1_2_method',
      body: xml,
    };

    try {
      request(options, async (error: any, response: any) => {
        if (error) { throw new Error(error) };
        const jsonObj = parser.parse(response.body, { parseNodeValue: false });

        const jsonObj2 = jsonObj[Object.keys(jsonObj)[0]];
        const jsonObj3 = jsonObj2[Object.keys(jsonObj2)[1]];
        const test = jsonObj3[Object.keys(jsonObj3)[1]].DanePobierzPelnyRaportResponse.DanePobierzPelnyRaportResult;
        const jsonObjX = parser.parse(decode(test), { parseNodeValue: false });

        const model: CompanyDataCeidg = new CompanyDataCeidg();

        model.DanePodstawowe = {
          Imie: '',
          Nazwisko: '',
          Firma: jsonObjX.root.dane.praw_nazwa,
          NIP: jsonObjX.root.dane.praw_nip,
          REGON: jsonObjX.root.dane.praw_regon9,
        };

        model.DaneAdresowe = {
          AdresGlownegoMiejscaWykonywaniaDzialalnosci: {
            Miejscowosc: jsonObjX.root.dane.praw_adSiedzMiejscowosc_Nazwa || '',
            Ulica: jsonObjX.root.dane.praw_adSiedzUlica_Nazwa || '',
            Budynek: jsonObjX.root.dane.praw_adSiedzNumerNieruchomosci || '',
            Lokal: jsonObjX.root.dane.praw_adSiedzNumerLokalu || '',
            KodPocztowy: jsonObjX.root.dane.praw_adSiedzKodPocztowy || '',
            Poczta: jsonObjX.root.dane.praw_adSiedzMiejscowoscPoczty_Nazwa || '',
            Gmina: jsonObjX.root.dane.praw_adSiedzGmina_Nazwa || '',
            Powiat: jsonObjX.root.dane.praw_adSiedzPowiat_Nazwa || '',
            Wojewodztwo: jsonObjX.root.dane.praw_adSiedzWojewodztwo_Nazwa || '',
          },
          AdresDoDoreczen: {
            Miejscowosc: jsonObjX.root.dane.praw_adKorMiejscowosc_Nazwa || '',
            Ulica: jsonObjX.root.dane.praw_adKorUlica_Nazwa || '',
            Budynek: jsonObjX.root.dane.praw_adKorNumerNieruchomosci || '',
            Lokal: jsonObjX.root.dane.praw_adKorNumerLokalu || '',
            KodPocztowy: jsonObjX.root.dane.praw_adKorKodPocztowy || '',
            Poczta: jsonObjX.root.dane.praw_adKorMiejscowoscPoczty_Nazwa || '',
            Gmina: jsonObjX.root.dane.praw_adKorGmina_Nazwa || '',
            Powiat: jsonObjX.root.dane.praw_adKorPowiat_Nazwa || '',
            Wojewodztwo: jsonObjX.root.dane.praw_adKorWojewodztwo_Nazwa || '',
          },
        };

        model.DaneDodatkowe = {
          DataRozpoczeciaWykonywaniaDzialalnosciGospodarczej: jsonObjX.root.dane.praw_dataRozpoczeciaDzialalnosci,
          DataWykresleniaWpisuZRejestru: jsonObjX.root.dane.praw_dataZakonczeniaDzialalnosci,
          Status: jsonObjX.root.dane.praw_dataZakonczeniaDzialalnosci !== '' ? 'Wykreślony' : 'Aktywny',
          KodyPKD: await findGusFullReportPkd(sid, regon, proxy, 'BIR11OsPrawnaPkd'),
        };

        model.DaneKontaktowe = {
          Telefon: jsonObjX.root.dane.praw_numerTelefonu,
          AdresPocztyElektronicznej: jsonObjX.root.dane.praw_adresEmail,
          AdresStronyInternetowej: jsonObjX.root.dane.praw_adresStronyinternetowej,
        };

        model.FormaPrawna = {
          podstawowa: jsonObjX.root.dane.praw_podstawowaFormaPrawna_Symbol || '',
          szczegolna: jsonObjX.root.dane.praw_szczegolnaFormaPrawna_Symbol || '',
        };

        const gusResponse: ResponseData[] = [];
        gusResponse.push(model.format('GUS'));

        return resolve(gusResponse);
      });
    } catch (error) {
      return reject(error);
    }
  });
}

async function findGusFullReportPkd(sid: string, regon: string, proxy: string, reportName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const xml = `
      <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="http://CIS/BIR/PUBL/2014/07">
        <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
          <wsa:Action>http://CIS/BIR/PUBL/2014/07/IUslugaBIRzewnPubl/DanePobierzPelnyRaport</wsa:Action>
          <wsa:To>https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc</wsa:To>
        </soap:Header>
        <soap:Body>
            <ns:DanePobierzPelnyRaport>
              <ns:pRegon>${regon}</ns:pRegon>
              <ns:pNazwaRaportu>${reportName}</ns:pNazwaRaportu>
            </ns:DanePobierzPelnyRaport>
        </soap:Body>
      </soap:Envelope>`;

    const options = {
      method: 'POST',
      ...(proxy !== undefined && {proxy: `${proxy}`}),
      url: urlGus,
      headers: {
        'Content-Type': 'application/soap+xml',
        sid: `${sid}`,
      },
      secureProtocol: 'TLSv1_2_method',
      body: xml,
    };

    try {
      request(options, (error: any, response: any) => {
        let myObj: string = '';
        if (error) { throw new Error(error) };
        const jsonObj = parser.parse(response.body, { parseNodeValue: false });
        const jsonObj2 = jsonObj[Object.keys(jsonObj)[0]];
        const jsonObj3 = jsonObj2[Object.keys(jsonObj2)[1]];
        const test = jsonObj3[Object.keys(jsonObj3)[1]].DanePobierzPelnyRaportResponse.DanePobierzPelnyRaportResult;

        const jsonObjX = parser.parse(decode(test), { parseNodeValue: false });
        // console.log(jsonObjX);
        if (Array.isArray(jsonObjX.root.dane)) {
          jsonObjX.root.dane.forEach((element: any) => {
            if(element.praw_pkdKod !== undefined) {
              myObj += myObj === '' ? element.praw_pkdKod : `,${element.praw_pkdKod}`;
            }
          });
        } else {
          if(jsonObjX.root.dane.praw_pkdKod !== undefined) {
            myObj += myObj === '' ? jsonObjX.root.dane.praw_pkdKod : `,${jsonObjX.root.dane.praw_pkdKod}`;
          }
        }

        return resolve(myObj);
      });
    } catch (error) {
      return reject(error);
    }
  });
}
