/** Códigos FIFA/API-Football (3 letras) → ISO 3166-1 alpha-2 para flagcdn */
const FIFA_TO_ISO2: Record<string, string> = {
  ARG: "ar",
  BRA: "br",
  USA: "us",
  MEX: "mx",
  ESP: "es",
  FRA: "fr",
  GER: "de",
  ENG: "gb",
  POR: "pt",
  NED: "nl",
  BEL: "be",
  CRO: "hr",
  URU: "uy",
  COL: "co",
  CHI: "cl",
  ECU: "ec",
  PER: "pe",
  JPN: "jp",
  KOR: "kr",
  AUS: "au",
  CAN: "ca",
  CRC: "cr",
  PAN: "pa",
  SUI: "ch",
  SRB: "rs",
  POL: "pl",
  DEN: "dk",
  SWE: "se",
  WAL: "gb-wls",
  SCO: "gb-sct",
  IRN: "ir",
  QAT: "qa",
  SAU: "sa",
  MAR: "ma",
  SEN: "sn",
  GHA: "gh",
  CMR: "cm",
  NGA: "ng",
  TUN: "tn",
  ALG: "dz",
  EGY: "eg",
  DOM: "do",
  JAM: "jm",
  BIH: "ba",
  HON: "hn",
  SLV: "sv",
  GUA: "gt",
  CRI: "cr",
  PAR: "py",
  BOL: "bo",
  VEN: "ve",
  ITA: "it",
  UKR: "ua",
  AUT: "at",
  CZE: "cz",
  TUR: "tr"
};

export function fifaCodeToIso2(code: string): string | null {
  const normalized = code.trim().toUpperCase();
  return FIFA_TO_ISO2[normalized] ?? null;
}

export function getFlagCdnUrl(code: string, width = 40): string | null {
  const iso = fifaCodeToIso2(code);
  if (!iso) return null;
  return `https://flagcdn.com/w${width}/${iso}.png`;
}
