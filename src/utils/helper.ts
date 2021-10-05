import queryString from 'query-string';

export const getParsed = (data: queryString.ParsedQuery<string>): Record<string, unknown> => {
  if (!data) {
    return {};
  }

  const parsed = Object.entries(data).reduce((prev, curr) => {
    const [key, value] = curr;
    const object: Record<string, unknown> = {};
    if (value) {
      object[`${key}`] = value;
    }
    return { ...prev, ...object };
  }, {});

  return parsed;
};
