type Fetcher = () => void;

const inventory: { [key: string]: Fetcher[] } = {};

export const add = (prefix: string, func: Fetcher): void => {
  const currentFetcher = inventory[prefix];

  if (typeof currentFetcher === 'undefined' || currentFetcher.length === 0) {
    inventory[prefix] = [func];
    return;
  }

  const isExisted = currentFetcher.find((o) => o === func);

  if (isExisted) {
    console.warn(`You already add fetcher for ${prefix}`);
    return;
  }

  inventory[prefix] = [...currentFetcher, func];
};

export const remove = (prefix: string, func: Fetcher): void => {
  const currentFetcher = inventory[prefix];

  if (typeof currentFetcher === 'undefined' || currentFetcher === null || currentFetcher.length === 0) {
    return;
  }

  inventory[prefix] = currentFetcher.filter((o) => o !== func);
};

export const get = (prefix: string): Fetcher[] => {
  return inventory[prefix] || [];
};
