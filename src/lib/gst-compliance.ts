// CheckMargin GST Compliance, Filing Rules & Document Requirements
// Covers Threshold Rules, Physical vs Digital differences, Invoicing Rule 46, and Filing Penalties

export interface GSTEvaluationQuery {
  productType: 'physical' | 'digital' | 'service';
  annualTurnover: number;     // in ₹ (e.g. 15,00,000)
  supplyScope: 'intra-state' | 'inter-state' | 'export';
  salesChannel: 'marketplace' | 'own_website' | 'offline_flea';
  stateType: 'normal' | 'special_category'; // special = NE states, J&K, Uttarakhand, Himachal
  isRegistered: boolean;
}

export interface GSTEvaluationVerdict {
  isMandatory: boolean;
  verdictTitle: string;
  verdictBadge: 'MANDATORY' | 'EXEMPT_ELIGIBLE' | 'VOLUNTARY_RECOMMENDED' | 'ZERO_RATED_EXPORT';
  applicableThreshold: number; // in ₹
  summary: string;
  legalBasis: string;
  actionItems: string[];
  exemptionsApplicable?: string;
  penaltiesIfNonCompliant: string;
}

/**
 * Deterministic evaluator answering: "Do I Need GST Registration?"
 */
export function evaluateGSTNeed(query: GSTEvaluationQuery): GSTEvaluationVerdict {
  const isPhysical = query.productType === 'physical';
  const isDigital = query.productType === 'digital' || query.productType === 'service';
  const isSpecialState = query.stateType === 'special_category';
  const isInterState = query.supplyScope === 'inter-state';
  const isExport = query.supplyScope === 'export';
  const isMarketplace = query.salesChannel === 'marketplace';

  // 1. Export of Goods or Services (including digital goods)
  if (isExport) {
    return {
      isMandatory: true,
      verdictTitle: 'GST Registration Mandatory for Zero-Rated Exports',
      verdictBadge: 'ZERO_RATED_EXPORT',
      applicableThreshold: 0,
      summary: 'Selling digital templates or physical goods to international customers (outside India) is treated as an Export under Section 16 of the IGST Act.',
      legalBasis: 'Section 24(i) & Section 16 of the IGST Act 2017.',
      actionItems: [
        'Register for regular GSTIN regardless of turnover.',
        'File Letter of Undertaking (LUT) online annually on the GST Portal to export without paying upfront IGST.',
        'Obtain Foreign Inward Remittance Certificate (FIRC) or BRC from payment processor (Stripe/PayPal/Razorpay).',
        'Claim 100% refund or offset of Input Tax Credit (ITC) paid on computers, raw materials, and SaaS software.',
      ],
      penaltiesIfNonCompliant: 'Export proceeds without GSTIN or LUT face 18% tax demand plus 18% annual interest under Section 50.',
    };
  }

  // 2. Physical Goods on E-commerce Marketplaces (Amazon, Flipkart)
  if (isPhysical && isMarketplace) {
    return {
      isMandatory: true,
      verdictTitle: 'Mandatory GST for Marketplace Physical Sellers',
      verdictBadge: 'MANDATORY',
      applicableThreshold: 0,
      summary: 'Marketplaces like Amazon India and Flipkart collect Tax Collected at Source (TCS) under Section 52 and strictly require an active GSTIN to onboard physical sellers.',
      legalBasis: 'Section 24(ix) & Section 52 of CGST Act 2017.',
      actionItems: [
        'Obtain regular GSTIN in the state where your dispatch studio/warehouse is located.',
        'Upload GSTIN on seller central dashboard to unlock listing capabilities.',
        'Note: Notification 34/2023 allows small sellers under ₹40L to sell intra-state on Meesho with an Enrolment ID, but inter-state shipping still triggers mandatory regular GST.',
      ],
      penaltiesIfNonCompliant: 'Marketplaces block non-GST accounts automatically; unauthorized inter-state sales face 100% tax penalty.',
    };
  }

  // 3. Digital Products sold domestically via Own Website / Digital Portals
  if (isDigital) {
    const serviceThreshold = isSpecialState ? 1000000 : 2000000; // 10L vs 20L
    const exceedsThreshold = query.annualTurnover > serviceThreshold;

    if (exceedsThreshold || isInterState) {
      return {
        isMandatory: true,
        verdictTitle: exceedsThreshold ? 'Turnover Exceeds ₹20 Lakhs Service Limit' : 'Inter-State Digital Sales Require GST',
        verdictBadge: 'MANDATORY',
        applicableThreshold: serviceThreshold,
        summary: `Digital downloads (Notion templates, ebooks, presets) are classified under SAC 9984 as OIDAR/services with a threshold of ₹${(serviceThreshold / 100000).toFixed(0)} Lakhs. Delivering across state borders legally triggers GST.`,
        legalBasis: 'Section 22(1) & Section 24 of CGST Act 2017.',
        actionItems: [
          'Register for GST as a Regular Service Taxpayer under SAC 9984.',
          'Charge 18% GST (9% CGST + 9% SGST for same state, 18% IGST for other states).',
          'Claim full ITC on software subscriptions (Figma, Adobe, Canva, hosting).',
        ],
        penaltiesIfNonCompliant: 'Penalty of 10% of tax evaded or ₹10,000, whichever is higher, under Section 122(1).',
      };
    } else {
      return {
        isMandatory: false,
        verdictTitle: 'Exempt From GST (Under ₹20 Lakhs Limit)',
        verdictBadge: 'EXEMPT_ELIGIBLE',
        applicableThreshold: serviceThreshold,
        summary: `Your annual digital product turnover (₹${query.annualTurnover.toLocaleString('en-IN')}) is below the statutory threshold of ₹${(serviceThreshold / 100000).toFixed(0)} Lakhs for service providers in your state.`,
        legalBasis: 'Section 22(1) of CGST Act 2017.',
        actionItems: [
          'No mandatory requirement to register or collect GST from Indian buyers.',
          'Issue simple commercial invoices without charging GST.',
          'Monitor cumulative 12-month turnover. Register within 30 days of crossing ₹20 Lakhs.',
        ],
        exemptionsApplicable: 'Section 22 small service provider threshold exemption.',
        penaltiesIfNonCompliant: 'None as long as turnover stays strictly below ₹20 Lakhs.',
      };
    }
  }

  // 4. Physical Goods via Own Website / Offline / Flea Markets
  const goodsThreshold = isSpecialState ? 2000000 : 4000000; // 20L vs 40L
  if (isInterState) {
    return {
      isMandatory: true,
      verdictTitle: 'Mandatory GST Due to Inter-State Physical Delivery',
      verdictBadge: 'MANDATORY',
      applicableThreshold: 0,
      summary: 'Shipping physical goods to a customer in another state (e.g., Delhi to Mumbai, Bangalore to Chennai) removes the ₹40 Lakh threshold and legally requires GST.',
      legalBasis: 'Section 24(i) of CGST Act (Compulsory registration in certain cases).',
      actionItems: [
        'Apply for regular GSTIN before dispatching parcels to other states.',
        'Courier partners (Delhivery, BlueDart) mandate GSTIN for B2B accounts and commercial invoicing.',
      ],
      penaltiesIfNonCompliant: 'Inter-state transit without valid invoice & GSTIN risk parcel seizure under Section 129.',
    };
  }

  if (query.annualTurnover > goodsThreshold) {
    return {
      isMandatory: true,
      verdictTitle: 'Mandatory GST (Turnover Exceeds ₹40 Lakhs)',
      verdictBadge: 'MANDATORY',
      applicableThreshold: goodsThreshold,
      summary: `Your intra-state physical craft business turnover (₹${query.annualTurnover.toLocaleString('en-IN')}) has crossed the statutory exemption threshold of ₹${(goodsThreshold / 100000).toFixed(0)} Lakhs.`,
      legalBasis: 'Section 22(1) of CGST Act read with Notification 10/2019-Central Tax.',
      actionItems: [
        'Register for GST within 30 days of crossing the threshold.',
        'Choose between Regular Scheme (to claim ITC) or Composition Scheme (1% flat tax if not selling inter-state).',
      ],
      penaltiesIfNonCompliant: 'Interest at 18% p.a. on uncollected tax + 10% penalty on total tax due.',
    };
  }

  return {
    isMandatory: false,
    verdictTitle: 'Exempt From GST (Intra-State Physical Goods)',
    verdictBadge: 'EXEMPT_ELIGIBLE',
    applicableThreshold: goodsThreshold,
    summary: `You sell physical craft products within your home state and your annual turnover is below the ₹${(goodsThreshold / 100000).toFixed(0)} Lakhs threshold limit.`,
    legalBasis: 'Notification No. 10/2019 - Central Tax (Threshold exemption for goods).',
    actionItems: [
      'You are legally exempt from registering and filing GST.',
      'Do NOT charge GST to customers on your invoices.',
      'Keep records of purchase receipts and sales vouchers.',
      'Voluntary registration is an option if you wish to recover Input Tax Credit on heavy equipment or studio rent.',
    ],
    exemptionsApplicable: '₹40 Lakhs intra-state physical goods exemption.',
    penaltiesIfNonCompliant: 'No compliance liability while within threshold.',
  };
}

export interface GSTFormSpec {
  name: string;
  purpose: string;
  frequency: string;
  dueDate: string;
  whoMustFile: string;
  lateFeePerDay: { normal: number; nil: number };
  maxPenaltyCap: string;
}

export const GST_FILING_SCHEDULE: GSTFormSpec[] = [
  {
    name: 'GSTR-1',
    purpose: 'Statement of Outward Supplies (Details of all sales invoices, credit notes & debit notes)',
    frequency: 'Monthly (or Quarterly under QRMP)',
    dueDate: '11th of the following month (Monthly) / 13th of month following quarter (QRMP)',
    whoMustFile: 'All regular registered taxpayers (even if 0 sales, NIL return must be filed)',
    lateFeePerDay: { normal: 50, nil: 20 },
    maxPenaltyCap: '₹500 for NIL return, ₹2,000 for turnover < ₹1.5 Cr, ₹5,000 for higher turnover',
  },
  {
    name: 'GSTR-3B',
    purpose: 'Monthly Summary Return & Payment of Net GST Liability (after offsetting eligible ITC)',
    frequency: 'Monthly (or Quarterly under QRMP)',
    dueDate: '20th of the following month (or 22nd/24th under QRMP based on state)',
    whoMustFile: 'All regular taxpayers. Crucial for matching with supplier GSTR-2B credit.',
    lateFeePerDay: { normal: 50, nil: 20 },
    maxPenaltyCap: '₹500 for NIL return, up to ₹5,000 for normal return + 18% interest on unpaid tax',
  },
  {
    name: 'CMP-08',
    purpose: 'Special Statement for Payment of Self-Assessed Tax under Composition Scheme (1% rate)',
    frequency: 'Quarterly',
    dueDate: '18th of the month following the end of quarter',
    whoMustFile: 'Small businesses registered under Section 10 Composition Scheme',
    lateFeePerDay: { normal: 50, nil: 20 },
    maxPenaltyCap: '₹500 per return',
  },
  {
    name: 'GSTR-9',
    purpose: 'Annual Consolidated Return summarizing all monthly filings, sales, and ITC claims',
    frequency: 'Annually',
    dueDate: '31st December following the end of financial year',
    whoMustFile: 'Taxpayers with annual turnover exceeding ₹2 Crores (optional under ₹2 Cr)',
    lateFeePerDay: { normal: 200, nil: 50 },
    maxPenaltyCap: '0.04% of state turnover',
  },
];

export interface InvoiceRuleItem {
  fieldNumber: number;
  fieldName: string;
  isRequired: boolean;
  explanation: string;
  example: string;
}

export const MANDATORY_INVOICE_FIELDS: InvoiceRuleItem[] = [
  { fieldNumber: 1, fieldName: 'Supplier Name, Address & GSTIN', isRequired: true, explanation: 'Legal business name and complete registered office address with 15-digit GSTIN.', example: 'CheckMargin Studio Pvt Ltd, 22 Park St, Mumbai - 27AAPCC1234F1Z5' },
  { fieldNumber: 2, fieldName: 'Consecutive Serial Number', isRequired: true, explanation: 'Unique sequential invoice number not exceeding 16 characters containing alphabets, numerals, or hyphens.', example: 'CMS/2026-27/0042' },
  { fieldNumber: 3, fieldName: 'Invoice Date', isRequired: true, explanation: 'The date on which the tax invoice was generated and issued to the buyer.', example: '17-Oct-2026' },
  { fieldNumber: 4, fieldName: 'Recipient Details (B2B / B2C)', isRequired: true, explanation: 'Name and address of recipient. If B2B, recipient GSTIN is mandatory for ITC pass-through.', example: 'Artisan Boutique, Pune - 27BBBC1234D1Z2' },
  { fieldNumber: 5, fieldName: 'HSN Code (Goods) or SAC Code (Digital)', isRequired: true, explanation: 'Minimum 4 digits for turnover up to ₹5 Cr, 6 digits for turnover above ₹5 Cr. 4-digit SAC for services.', example: '3406 (Candles) or 9984 (Digital template)' },
  { fieldNumber: 6, fieldName: 'Description of Goods or Services', isRequired: true, explanation: 'Clear description of product model, weight, or format.', example: 'French Vanilla Soy Candle 200g Glass Jar' },
  { fieldNumber: 7, fieldName: 'Quantity and Unit of Measurement (UQC)', isRequired: true, explanation: 'Number of units, pieces, grams, or kg.', example: '10 PCS' },
  { fieldNumber: 8, fieldName: 'Total Value of Supplies', isRequired: true, explanation: 'Gross value before discounts or taxable separation.', example: '₹5,990.00' },
  { fieldNumber: 9, fieldName: 'Taxable Value', isRequired: true, explanation: 'Value on which GST rate is levied after deducting trade discounts.', example: '₹5,704.76' },
  { fieldNumber: 10, fieldName: 'GST Tax Rates & Tax Amounts', isRequired: true, explanation: 'Breakdown of CGST & SGST (if intra-state) or IGST (if inter-state).', example: 'CGST @ 2.5% = ₹142.62, SGST @ 2.5% = ₹142.62' },
  { fieldNumber: 11, fieldName: 'Place of Supply (POS) with State Name', isRequired: true, explanation: 'State name and code where goods are delivered.', example: 'Maharashtra (State Code 27)' },
  { fieldNumber: 12, fieldName: 'Signature / Digital Signature', isRequired: true, explanation: 'Authorized signatory signature or DSC stamp.', example: 'Authorized Signatory (Digital Stamp)' },
];

export interface EWayBillRules {
  interStateThreshold: number;
  intraStateThresholdGeneral: number;
  intraStateThresholdExceptions: { state: string; limit: number }[];
  validityDaysPerDistance: string;
  digitalProductRule: string;
}

export const EWAY_BILL_RULES: EWayBillRules = {
  interStateThreshold: 50000,
  intraStateThresholdGeneral: 50000,
  intraStateThresholdExceptions: [
    { state: 'Maharashtra', limit: 100000 },
    { state: 'Delhi', limit: 100000 },
    { state: 'West Bengal', limit: 100000 },
    { state: 'Tamil Nadu', limit: 100000 },
  ],
  validityDaysPerDistance: '1 day per every 200 km (or part thereof) for regular cargo.',
  digitalProductRule: 'E-Way Bills are strictly for physical movement of goods. Digital products & downloads are completely exempt from E-Way bill generation.',
};
