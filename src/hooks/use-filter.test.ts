import queryString from 'query-string';

fit('parse value for use filter', () => {
  const url = 'classType=NORMAL&classType=TRIAL';
  const parsed = queryString.parse(url);
  console.log(8, parsed);
});
