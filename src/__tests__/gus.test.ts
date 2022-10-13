import { CompanyData } from '../index';
import { ResponseData } from '../viewModel/Response';

const token = 'fe5612bd5584448e8258';

test('GUS - Test - nip istnieje', async () => {
  const data = new CompanyData('gus',
    token,
    'nip',
    '5220002860',
    '');
  
  const result = await data.GetCompanyData();
  // console.log(result);
  expect(result[0].nip).toBe('5220002860');
});

test('GUS - Test - nip bledny', async () => {
  const data = new CompanyData('gus',
    token,
    'nip',
    '1181514653',
    '');
  
  const result = await data.GetCompanyData();
  // console.log(result);
  expect(result[0].nip).toBeUndefined();
});

test('GUS - Test - nip wykreslony', async () => {
  const data = new CompanyData('gus',
    token,
    'nip',
    '5262548670',
    '');

  const result = await data.GetCompanyData();
  console.log(result);
  expect(result[0].status).toBe('Wykreślony');
});

