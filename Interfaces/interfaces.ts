export interface ICountry {
  name: {
    common: string;
    official: string;
    nativeName: {
      [key: string]: {
        official: string;
        common: string;
      };
    };
  };
  cca2: string;
  currencies: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  capital: string;
  region: string;
  subregion: string;
  languages: {
    [key: string]: string;
  };
  latlng: string[];
  landlocked: boolean;
  borders: [];
  area: number;
  flag: string;
  population: number;
  gini: {
    [key: string]: number;
  };
  car: {
    side: string;
  };
  startOfWeek: string;
  capitalInfo: {
    latlng: number[];
  };
}

export interface IssJsonObject {
  iss_position: {
    longitude: string;
    latitude: string;
  };
  timestamp: number;
}
