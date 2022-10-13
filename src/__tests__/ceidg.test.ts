import { CompanyData } from '../index';
import { ResponseData } from '../viewModel/Response';

const token = 'eyJraWQiOiJjZWlkZyIsImFsZyI6IkhTNTEyIn0.eyJnaXZlbl9uYW1lIjoiVE9NQVNaIiwicGVzZWwiOiI4MTEyMjgwMDQ1OSIsImlhdCI6MTY0OTA3OTA0NCwiZmFtaWx5X25hbWUiOiJGSUxJUEtPV1NLSSIsImNsaWVudF9pZCI6IlVTRVItODExMjI4MDA0NTktVE9NQVNaLUZJTElQS09XU0tJIn0.RHw0_9FLRPkRBu-wQuS2wuCO9kgO-COIfX4tVRgwpDFSr15y5dwxnt5XB-F6Rkqzc56__EfqCuxMECpgn_DOoQ';

test('CEiDG - Test - nip istnieje', async () => {
  const data = new CompanyData('ceidg',
    token,
    'nip',
    '1181514653',
    '');
  
  const result = await data.GetCompanyData();
  // console.log(result);
  
  expect(result[0].nip).toBe('1181514653');
});

test('CEiDG - Test - nip bledny', async () => {
  const data = new CompanyData('ceidg',
    token,
    'nip',
    '1181514654',
    '');

  const result = await data.GetCompanyData();
  console.log(data);
  expect(result).toHaveLength(0);
});
