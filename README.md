# ceidg-gus-checker
 
Sprawdź kontahenta w bazie CEIDG i GUS

## Przykładowe użycie:
Sprawdź dane kontahenta w CEIDG. Jeśli ich nie (np. w przypadku spółki) to sprawdź dane w GUS:

```
import { CompanyData } from 'ceidg-gus-checker';

const checker = new CompanyData(
    'ceidg', // source
    'xyz123', // token
    '', // type
    611234567, // num
    'http://<myproxy>:<portNumber>', // optional: proxy
);

checker.GetCompanyData().then(function(result){
    if (!result.length) {
        checker.source = 'gus';
        checker.token = 'abc456';
        checker.type = 'nip';

        checker.GetCompanyData().then(function(result){
            console.log(result);
        });

    } else {
        console.log(result);
    }
});
```