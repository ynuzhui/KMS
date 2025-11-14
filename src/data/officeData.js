export const OFFICE_PRODUCTS = {
  office2010: 'Office 2010',
  office2013: 'Office 2013',
  office2016: 'Office 2016',
  office2019: 'Office 2019',
  office2021: 'Office 2021',
  office365: 'Office 365',
  officeLTSC2021: 'Office LTSC 2021',
  officeLTSC2024: 'Office LTSC 2024',
  projectLTSC2021: 'Project LTSC 2021',
  projectLTSC2024: 'Project LTSC 2024',
  visioLTSC2021: 'Visio LTSC 2021',
  visioLTSC2024: 'Visio LTSC 2024'
};

export const OFFICE_VERSIONS = {
  office2010: {
    proPlus: '专业增强版',
    standard: '标准版'
  },
  office2013: {
    proPlus: '专业增强版',
    standard: '标准版'
  },
  office2016: {
    proPlus: '专业增强版',
    standard: '标准版'
  },
  office2019: {
    proPlus: '专业增强版',
    standard: '标准版',
    homeBusiness: '家庭和商业版'
  },
  office2021: {
    proPlus: '专业增强版',
    standard: '标准版',
    homeBusiness: '家庭和商业版'
  },
  office365: {
    proPlus: 'ProPlus',
    standard: '标准版',
    business: 'Business',
    businessPremium: 'Business Premium'
  },
  
  officeLTSC2021: {
    proPlus: 'Professional Plus',
    standard: 'Standard'
  },
  officeLTSC2024: {
    proPlus: 'Professional Plus',
    standard: 'Standard'
  },
  projectLTSC2021: {
    professional: 'Professional',
    standard: 'Standard'
  },
  projectLTSC2024: {
    professional: 'Professional',
    standard: 'Standard'
  },
  visioLTSC2021: {
    professional: 'Professional',
    standard: 'Standard'
  },
  visioLTSC2024: {
    professional: 'Professional',
    standard: 'Standard'
  }
};

export const OFFICE_KMS_KEYS = {
  office2010: {
    proPlus: 'VYBBJ-TRJPB-QFQRF-QFT4D-H3GVB',
    standard: 'V7QKV-4XVVR-XYV4D-F7DFM-8R6BM'
  },
  office2013: {
    proPlus: 'YC7DK-G2NP3-2QQC3-J6H88-GVGXT',
    standard: 'KBKQT-2NMXY-JJWGP-M62JB-92CD4'
  },
  office2016: {
    proPlus: 'XQNVK-8JYDB-WJ9W3-YJ8YR-WFG99',
    standard: 'JNRGM-WHDWX-FJJG3-K47QV-DRTFM'
  },
  office2019: {
    proPlus: 'NMMKJ-6RK4F-KMJVX-8D9MJ-6MWKP',
    standard: '6NWWJ-YQWMR-QKGCB-6TMB3-9D9HK',
    homeBusiness: 'B4NPR-3FKK7-T2MBV-FRQ4W-PKD2B'
  },
  office2021: {
    proPlus: 'FXYTK-NJJ8C-GB6DW-3DYQT-6F7TH',
    standard: 'KDX7X-BNVR8-TXXGX-4Q7Y8-78VT3',
    homeBusiness: 'Q2KDJ-9GH2X-9QBW9-7Q6CR-QG6M8'
  },
  office365: {
    proPlus: 'KMSCLIENT',
    standard: 'KMSCLIENT',
    business: 'KMSCLIENT',
    businessPremium: 'KMSCLIENT'
  },
  
  officeLTSC2021: {
    proPlus: 'FXYTK-NJ8BC-GB6DW-3DYQT-6F7TH',
    standard: 'KGQNK-GDP6M-DGPRT-FT8X4-2QY98'
  },
  officeLTSC2024: {
    proPlus: 'FXYTK-NJ8BC-GB6DW-3DYQT-6F7TH',
    standard: 'KGQNK-GDP6M-DGPRT-FT8X4-2QY98'
  },
  projectLTSC2021: {
    professional: 'C4F7P-NCP8C-6CQPT-MQHV9-JXD2M',
    standard: 'JXRFM-N3B63-DWJ2K-4G372-882QB'
  },
  projectLTSC2024: {
    professional: 'C4F7P-NCP8C-6CQPT-MQHV9-JXD2M',
    standard: 'JXRFM-N3B63-DWJ2K-4G372-882QB'
  },
  visioLTSC2021: {
    professional: 'P9N92-8JK7D-RJRJK-7XMP9-BQ3T8',
    standard: '7WHWN-4T7MP-G96JF-G33KR-W8GF4'
  },
  visioLTSC2024: {
    professional: 'P9N92-8JK7D-RJRJK-7XMP9-BQ3T8',
    standard: '7WHWN-4T7MP-G96JF-G33KR-W8GF4'
  }
};

export function generateOfficeScript(product, version) {
  const key = OFFICE_KMS_KEYS[product]?.[version] || '';
  if (!key || !OFFICE_PRODUCTS[product] || !OFFICE_VERSIONS[product]?.[version]) return '';
  
  
  const kmsServer = import.meta.env.VITE_KMS_SERVER_ADDRESS || 's1.kms.cx';
  const script = `slmgr /skms ${kmsServer}
slmgr /ipk ${key}
slmgr /ato
slmgr /xpr
pause`;
  
  return script;
}