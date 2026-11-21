export type RegionFilter = 'all' | 'europe' | 'asia-pacific' | 'americas-mea';

export type ProgramType =
  | 'Executive Retreat'
  | 'Business & Leisure Stay'
  | 'Sales Incentive'
  | 'Annual Summit';

export type HospitalityTier = 'Executive' | 'Boardroom Luxury';

export type BookingStatus = 'Confirmed' | 'Cancelled' | 'Completed';

export interface AgendaDay {
  day: string;
  focus: string;
  morning: string;
  afternoon: string;
  evening: string;
}

export interface DestinationHub {
  id: string;
  city: string;
  country: string;
  region: Exclude<RegionFilter, 'all'>;
  regionLabel: string;
  airportCode: string;
  transferMinutes: number;
  maxDelegates: number;
  breakoutRooms: number;
  plenarySqm: number;
  baseDailyRateUsd: number;
  bestMonths: string;
  famousLandmarks: string;
  headline: string;
  summary: string;
  venueHighlights: string[];
  imageUrl: string;
  imageAlt: string;
  sampleAgenda: AgendaDay[];
}

export interface CapabilityItem {
  number: string;
  title: string;
  span: 'wide' | 'standard';
  outcome: string;
  deliverables: string[];
  metricLabel: string;
  metricValue: string;
}

export interface CaseStudy {
  id: string;
  client: string;
  sector: string;
  hub: string;
  delegates: number;
  durationDays: number;
  headlineMetric: string;
  metricContext: string;
  challenge: string;
  execution: string;
  quote: string;
  authorName: string;
  authorRole: string;
}

export interface EstimateTransferPayload {
  hubId: string;
  programType: ProgramType;
  delegates: number;
  days: number;
  tier: HospitalityTier;
  estimatedTotalUsd: number;
}

export interface CustomerProfile {
  name: string;
  email: string;
  company: string;
}

export interface CustomerBooking {
  id: string;
  referenceCode: string;
  customerName: string;
  customerEmail: string;
  company: string;
  hubId: string;
  city: string;
  country: string;
  airportCode: string;
  programType: ProgramType;
  tier: HospitalityTier;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guests: number;
  totalUsd: number;
  status: BookingStatus;
  createdAt: string;
  specialRequests?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  refundAmountUsd?: number;
}

export const HERO_MEDIA = {
  imageUrl: '/src/assets/images/unreal_hero_backdrop_1795266161251.jpg',
  imageAlt:
    'Cantilevered glass and basalt executive pavilion perched above a mirror-calm alpine fjord and snow-capped peaks at golden-hour twilight',
};

export const HERO_METRICS = [
  {
    value: '24',
    label: 'Global Tourism & MICE Hubs',
    detail: 'Iconic cities & lakeside estates',
  },
  {
    value: '14 Days',
    label: 'Flexible Cancellation Window',
    detail: '100% refundable prior to 14 days out',
  },
  {
    value: '99.4%',
    label: 'On-Time Ground Protocol',
    detail: 'Direct airport tarmac & rail links',
  },
  {
    value: '18,400+',
    label: 'Business Travelers Hosted',
    detail: 'From solo executives to 500-seat forums',
  },
];

export const CAPABILITIES: CapabilityItem[] = [
  {
    number: '01',
    title: 'Executive Summits & Board Retreats',
    span: 'wide',
    outcome:
      'Private, acoustically isolated estates and lakeside conference pavilions engineered for confidential M&A alignment, annual strategy offsites, and C-suite governance.',
    deliverables: [
      'Full-property buyouts with vetted diplomatic security',
      'Simultaneous 6-language interpretation & redundant fiber',
      'Curated off-site cultural access outside public hours',
    ],
    metricLabel: 'Average C-Suite Satisfaction',
    metricValue: '98.8% post-program rating',
  },
  {
    number: '02',
    title: 'Bleisure & Incentive Journeys',
    span: 'standard',
    outcome:
      'Tailored city stays pairing executive meetings with iconic landmark access, five-star hospitality, and seamless group airfare.',
    deliverables: [
      'Tiered welcome concierge & luggage fast-track',
      'Bespoke culinary buyouts & private river charters',
      'Flexible self-service portal rescheduling & cancellation',
    ],
    metricLabel: 'Participant Retention Lift',
    metricValue: '+27% YoY quota attainment',
  },
  {
    number: '03',
    title: 'Large-Scale Conferences & Forums',
    span: 'standard',
    outcome:
      'Turnkey plenary production, multi-track breakout routing, and badge-to-transfer choreography for global sales kickoffs and client symposia.',
    deliverables: [
      'Stage architecture, broadcast AV & keynote coaching',
      'Real-time delegate flight manifest & delay rerouting',
      'Sponsor pavilion fabrication & lead capture ops',
    ],
    metricLabel: 'Max Single-Campus Capacity',
    metricValue: '1,200 delegates per hub',
  },
  {
    number: '04',
    title: 'Aviation, Visas & Diplomatic Protocol',
    span: 'wide',
    outcome:
      'Single-manifest coordination across scheduled business-class blocks, regional turboprop charters, tarmac VIP transfers, and fast-track immigration clearance.',
    deliverables: [
      '24/7 flight operations desk monitoring weather & slot delays',
      'Consolidated IATA corporate fare negotiation & carbon ledger',
      'Executive security escort & customs pre-clearance support',
    ],
    metricLabel: 'Manifest Recovery SLA',
    metricValue: 'Under 22 min reroute time',
  },
];

export const DESTINATION_HUBS: DestinationHub[] = [
  {
    id: 'paris',
    city: 'Paris',
    country: 'France',
    region: 'europe',
    regionLabel: 'Europe',
    airportCode: 'CDG',
    transferMinutes: 35,
    maxDelegates: 480,
    breakoutRooms: 16,
    plenarySqm: 1680,
    baseDailyRateUsd: 960,
    bestMonths: 'Apr – Jul / Sep – Nov',
    famousLandmarks: 'Eiffel Tower · Seine River · Louvre Private Access',
    headline: 'Haussmann riverside terraces overlooking the Seine and Eiffel Tower.',
    summary:
      'A timeless European capital for client advisory boards, luxury brand forums, and executive leisure stays combining Champs-Élysées boardrooms with private Seine charters.',
    venueHighlights: [
      'Private Haussmann limestone terrace with direct Eiffel Tower sightlines',
      'After-hours curator-led gallery access at historic Paris museums',
      'Chauffeured CDG / Le Bourget VIP tarmac transfers',
    ],
    imageUrl: '/src/assets/images/dest_paris_hub_1795265886741.jpg',
    imageAlt: 'Haussmann business hotel terrace in Paris overlooking the Seine and Eiffel Tower',
    sampleAgenda: [
      {
        day: 'Day 01',
        focus: 'Seine Arrival & Client Reception',
        morning: 'VIP arrival at CDG or Gare du Nord with direct hotel check-in.',
        afternoon: 'Executive briefing inside private Champs-Élysées salons.',
        evening: 'Sunset private river cruise and dinner along the Seine.',
      },
      {
        day: 'Day 02',
        focus: 'Forum Keynotes & Louvre After-Hours',
        morning: 'Plenary keynotes and regional partner roundtables.',
        afternoon: 'Curated culinary workshop or Versailles architectural visit.',
        evening: 'Private evening gallery walkthrough and tasting dinner.',
      },
      {
        day: 'Day 03',
        focus: 'Synthesis & Departures',
        morning: 'Executive summary breakfast on the Eiffel-view terrace.',
        afternoon: 'Staggered limousine transfers to CDG and Eurostar terminals.',
        evening: 'Digital expense dossier & VAT recovery package issued.',
      },
    ],
  },
  {
    id: 'dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'americas-mea',
    regionLabel: 'Middle East & Americas',
    airportCode: 'DXB',
    transferMinutes: 16,
    maxDelegates: 750,
    breakoutRooms: 24,
    plenarySqm: 2600,
    baseDailyRateUsd: 890,
    bestMonths: 'Oct – Apr',
    famousLandmarks: 'Burj Khalifa · Museum of the Future · Palm Jumeirah',
    headline: 'Downtown skyline pavilions minutes from DXB and the Burj Khalifa district.',
    summary:
      'Strategic EMEA-APAC midpoint engineered for global partner summits, sovereign investment briefings, and winter incentive programs with unmatched aviation reach.',
    venueHighlights: [
      'Infinity reflection terrace overlooking the Burj Khalifa skyline',
      'DXB Al Majlis VIP terminal fast-track in under 15 minutes',
      'Private desert conservation reserve gala dining & astronomy',
    ],
    imageUrl: '/src/assets/images/dest_dubai_hub_1795265888051.jpg',
    imageAlt: 'Downtown Dubai glass hospitality pavilion overlooking the Burj Khalifa at twilight',
    sampleAgenda: [
      {
        day: 'Day 01',
        focus: 'Global Convergence at Downtown',
        morning: 'Al Majlis VIP immigration greeting at DXB and express convoy.',
        afternoon: 'DIFC financial briefing and partner welcome sessions.',
        evening: 'Twilight skyline reception beside the Downtown reflection pool.',
      },
      {
        day: 'Day 02',
        focus: 'Innovation Forum & Desert Reserve',
        morning: 'Main-stage keynotes and Museum of the Future private tour.',
        afternoon: 'Bilateral deal rooms across 24 soundproof board suites.',
        evening: 'Private lantern-lit banquet inside the Dubai Desert Reserve.',
      },
      {
        day: 'Day 03',
        focus: 'Coastal Reset & Long-Haul Departures',
        morning: 'Private yacht roundtable departing Dubai Harbour.',
        afternoon: 'Late hotel checkout aligned to evening DXB departure banks.',
        evening: 'Consolidated billing & executive summary delivered.',
      },
    ],
  },
  {
    id: 'newyork',
    city: 'New York',
    country: 'United States',
    region: 'americas-mea',
    regionLabel: 'Middle East & Americas',
    airportCode: 'JFK',
    transferMinutes: 35,
    maxDelegates: 550,
    breakoutRooms: 18,
    plenarySqm: 1950,
    baseDailyRateUsd: 1040,
    bestMonths: 'Apr – Jun / Sep – Dec',
    famousLandmarks: 'Central Park · Midtown Skyline · Fifth Avenue',
    headline: 'High-floor Midtown executive clubs overlooking Central Park and Manhattan.',
    summary:
      'Designed for capital markets roadshows, board meetings, and North American leadership summits requiring immediate proximity to Midtown and Wall Street.',
    venueHighlights: [
      'Penthouse oak-and-glass terraces with panoramic Central Park views',
      'Dedicated Teterboro (TEB) and JFK helicopter/sedan dispatch',
      'Private after-hours museum dining and Broadway house seats',
    ],
    imageUrl: '/src/assets/images/dest_newyork_hub_1795265887424.jpg',
    imageAlt: 'Midtown Manhattan executive lounge and glass terrace overlooking Central Park',
    sampleAgenda: [
      {
        day: 'Day 01',
        focus: 'Manhattan Arrival & Investor Briefing',
        morning: 'Chauffeured pickup from JFK or Teterboro to Midtown.',
        afternoon: 'Institutional investor roundtables in Central Park suites.',
        evening: 'Private chef dinner overlooking the illuminated Fifth Avenue skyline.',
      },
      {
        day: 'Day 02',
        focus: 'Leadership Forum & Cultural Access',
        morning: 'Main-stage executive sessions and analyst Q&A.',
        afternoon: 'Guided architectural walk through Hudson Yards and SoHo.',
        evening: 'Private Lincoln Center performance or rooftop reception.',
      },
      {
        day: 'Day 03',
        focus: 'Board Wrap & Transatlantic Departures',
        morning: 'Closing working breakfast and quarterly sign-off.',
        afternoon: 'Express Blade or sedan transfers to JFK, EWR, and LGA.',
        evening: 'Complete corporate travel ledger transmitted.',
      },
    ],
  },
  {
    id: 'london',
    city: 'London',
    country: 'United Kingdom',
    region: 'europe',
    regionLabel: 'Europe',
    airportCode: 'LHR',
    transferMinutes: 40,
    maxDelegates: 460,
    breakoutRooms: 15,
    plenarySqm: 1600,
    baseDailyRateUsd: 950,
    bestMonths: 'May – Oct',
    famousLandmarks: 'Tower Bridge · River Thames · Westminster',
    headline: 'Thames-side corporate pavilions framed by Tower Bridge and the City.',
    summary:
      'Ideal for transatlantic board meetings, legal & financial symposia, and executive client hosting with private river boat transfers between Westminster and Canary Wharf.',
    venueHighlights: [
      'Private Thames riverfront terrace facing Tower Bridge',
      'Heathrow Windsor Suite VIP arrival and Paddington Express links',
      'Exclusive Guildhall and historic Mayfair private club dining',
    ],
    imageUrl: '/src/assets/images/dest_london_hub_1795265888537.jpg',
    imageAlt: 'Riverside London corporate pavilion terrace overlooking Tower Bridge at dusk',
    sampleAgenda: [
      {
        day: 'Day 01',
        focus: 'City Arrival & Thames Welcome',
        morning: 'Heathrow VIP arrival and express transfer to the Thames.',
        afternoon: 'Cross-border leadership briefing in riverfront board suites.',
        evening: 'Dusk reception overlooking Tower Bridge.',
      },
      {
        day: 'Day 02',
        focus: 'Symposium & Historic Guildhall Gala',
        morning: 'Keynote tracks with simultaneous New York video link.',
        afternoon: 'Private Thames clipper charter to Greenwich Observatory.',
        evening: 'Black-tie or smart-casual private dining at a City landmark.',
      },
      {
        day: 'Day 03',
        focus: 'Closing Brief & Departures',
        morning: 'Morning wrap-up and partner alignment sprints.',
        afternoon: 'Coordinated Heathrow and St Pancras Eurostar transfers.',
        evening: 'Post-event summary & carbon report issued.',
      },
    ],
  },
  {
    id: 'zurich',
    city: 'Zurich',
    country: 'Switzerland',
    region: 'europe',
    regionLabel: 'Europe',
    airportCode: 'ZRH',
    transferMinutes: 18,
    maxDelegates: 420,
    breakoutRooms: 14,
    plenarySqm: 1450,
    baseDailyRateUsd: 920,
    bestMonths: 'May – Oct / Jan – Mar',
    famousLandmarks: 'Lake Zurich · Swiss Alps · Bahnhofstrasse',
    headline: 'Lakeside governance pavilions with direct private rail and ZRH tarmac transfers.',
    summary:
      'Built for financial institutions, life sciences boards, and European leadership summits requiring strict privacy, punctual rail links, and zero-friction alpine access.',
    venueHighlights: [
      'Exclusive-use limestone atrium overlooking Lake Zurich',
      'Private electric lake ferry for cross-shore executive dinners',
      'Redundant dual-carrier 10Gbps conference fiber',
    ],
    imageUrl: '/src/assets/images/dest_zurich_hub_1795265558592.jpg',
    imageAlt: 'Luxury Swiss corporate conference hotel on the shore of Lake Zurich',
    sampleAgenda: [
      {
        day: 'Day 01',
        focus: 'Arrival & Governance Alignment',
        morning: 'VIP tarmac pickup at ZRH and express lakeside check-in.',
        afternoon: 'Boardroom plenary briefing with simultaneous multilingual audio.',
        evening: 'Private acoustic dinner inside the lakeside glass conservatory.',
      },
      {
        day: 'Day 02',
        focus: 'Strategy Sprints & Alpine Reset',
        morning: 'Three parallel breakout tracks across lake-view suites.',
        afternoon: 'Chartered cogwheel rail ascent for walking executive roundtables.',
        evening: 'Fireside portfolio review and Swiss cellar tasting.',
      },
      {
        day: 'Day 03',
        focus: 'Commitment & Seamless Departure',
        morning: 'Closing town hall synthesis and quarterly roadmap sign-off.',
        afternoon: 'Staggered limousine dispatch aligned to long-haul flight banks.',
        evening: 'Digital action-ledger & carbon audit report delivered to Chief of Staff.',
      },
    ],
  },
  {
    id: 'singapore',
    city: 'Singapore',
    country: 'Singapore',
    region: 'asia-pacific',
    regionLabel: 'Asia-Pacific',
    airportCode: 'SIN',
    transferMinutes: 22,
    maxDelegates: 650,
    breakoutRooms: 20,
    plenarySqm: 2200,
    baseDailyRateUsd: 860,
    bestMonths: 'Year-Round',
    famousLandmarks: 'Marina Bay · Gardens by the Bay · Heritage Shophouses',
    headline: 'APAC headquarters hub uniting Changi VIP protocol with Marina Bay sky terraces.',
    summary:
      'The premier crossroads for Asia-Pacific sales kickoffs, sovereign investor forums, and cross-regional product summits with unmatched air connectivity.',
    venueHighlights: [
      'Changi JetQuay private terminal clearance in under 12 minutes',
      'Biophilic sky-terrace reception decks for 300+ guests',
      'Full broadcast-grade LED stage & hybrid global streaming hub',
    ],
    imageUrl: '/src/assets/images/dest_singapore_hub_1795265559574.jpg',
    imageAlt: 'Executive biophilic sky-terrace lounge in Singapore Marina Bay at twilight',
    sampleAgenda: [
      {
        day: 'Day 01',
        focus: 'APAC Convergence',
        morning: 'Private terminal greeting at SIN with direct luggage transfer.',
        afternoon: 'Regional GM alignment workshops in Marina Bay board suites.',
        evening: 'Twilight executive cocktail reception on the 42nd-floor garden terrace.',
      },
      {
        day: 'Day 02',
        focus: 'Market Expansion Forum',
        morning: 'Main-stage keynotes with live broadcast link to London & New York.',
        afternoon: 'Curated partner 1-on-1 deal rooms across 20 soundproof suites.',
        evening: 'Private Heritage Shophouse Michelin-curated closing banquet.',
      },
      {
        day: 'Day 03',
        focus: 'Innovation Labs & Departures',
        morning: 'Guided briefing with regional fintech & logistics founders.',
        afternoon: 'Express baggage check-in at hotel prior to evening Changi flights.',
        evening: 'Post-event attendee engagement analytics delivered.',
      },
    ],
  },
  {
    id: 'barcelona',
    city: 'Barcelona',
    country: 'Spain',
    region: 'europe',
    regionLabel: 'Europe',
    airportCode: 'BCN',
    transferMinutes: 20,
    maxDelegates: 500,
    breakoutRooms: 16,
    plenarySqm: 1850,
    baseDailyRateUsd: 780,
    bestMonths: 'Mar – Jun / Sep – Nov',
    famousLandmarks: 'Port Vell Harbor · Sagrada Família · Gothic Quarter',
    headline: 'Sunlit travertine forum pavilions bridging Mediterranean hospitality and EMEA scale.',
    summary:
      'Ideal for EMEA client conferences, annual partner ecosystems, and high-energy incentive retreats offering abundant outdoor architectural terraces and direct transatlantic flights.',
    venueHighlights: [
      'Private harbor-view travertine pavilion for keynotes and receptions',
      'Dedicated BCN group fast-track lane and coastal shuttle fleet',
      'After-hours architectural buyouts at modernist landmarks',
    ],
    imageUrl: '/src/assets/images/dest_barcelona_hub_1795265559667.jpg',
    imageAlt: 'Modernist travertine corporate forum terrace overlooking Barcelona harbor',
    sampleAgenda: [
      {
        day: 'Day 01',
        focus: 'EMEA Opening Forum',
        morning: 'Direct BCN arrival transfers and harbor-front accreditation.',
        afternoon: 'Opening plenary inside the sunlit travertine auditorium.',
        evening: 'Mediterranean courtyard welcome reception overlooking the marina.',
      },
      {
        day: 'Day 02',
        focus: 'Partner Ecosystems & Culture',
        morning: 'Breakout tracks and live product architecture clinics.',
        afternoon: 'Private catamaran regatta or curated design-district studio visits.',
        evening: 'Exclusive gala dinner in a private Catalan modernist estate.',
      },
      {
        day: 'Day 03',
        focus: 'Closing Keynotes & Transfers',
        morning: 'Executive panel and recognition awards ceremony.',
        afternoon: 'Coordinated BCN terminal drop-offs by departure wave.',
        evening: 'Consolidated billing & VAT recovery documentation issued.',
      },
    ],
  },
  {
    id: 'kyoto',
    city: 'Kyoto',
    country: 'Japan',
    region: 'asia-pacific',
    regionLabel: 'Asia-Pacific',
    airportCode: 'KIX',
    transferMinutes: 55,
    maxDelegates: 120,
    breakoutRooms: 6,
    plenarySqm: 540,
    baseDailyRateUsd: 1080,
    bestMonths: 'Mar – May / Oct – Dec',
    famousLandmarks: 'Arashiyama Bamboo · Historic Temples · Moss Gardens',
    headline: 'Hinoki-cedar sanctuary retreats built for deep strategic focus and board renewal.',
    summary:
      'Designed specifically for intimate 15-to-120 leader retreats where distraction-free contemplation, cultural craft, and Shinkansen connectivity from Tokyo elevate long-horizon thinking.',
    venueHighlights: [
      'Exclusive cedar-and-glass garden pavilions with zero public footfall',
      'Private Shinkansen green-car blocks from Tokyo Station (135 min)',
      'Executive wellness programming including private temple access',
    ],
    imageUrl: '/src/assets/images/dest_kyoto_hub_1795265558477.jpg',
    imageAlt: 'Japanese cedar executive retreat pavilion overlooking a moss garden in Kyoto',
    sampleAgenda: [
      {
        day: 'Day 01',
        focus: 'Quiet Immersion',
        morning: 'Chartered Nozomi Shinkansen carriage arrival at Kyoto Station.',
        afternoon: 'Unplugged long-term vision session overlooking moss gardens.',
        evening: 'Multi-course kaiseki dinner prepared by a private residence chef.',
      },
      {
        day: 'Day 02',
        focus: 'Deep Strategic Architecture',
        morning: 'Small-group working dialogues across cedar tatami and glass salons.',
        afternoon: 'Private 16th-century temple garden walk with Zen leadership historian.',
        evening: 'Intimate courtyard reflection and informal executive dialogue.',
      },
      {
        day: 'Day 03',
        focus: 'Synthesis & Return',
        morning: 'Final 3-year operating thesis presentation and commitment signing.',
        afternoon: 'Private transfers to KIX international departures or Tokyo rail.',
        evening: 'Bound executive briefing dossier dispatched to headquarters.',
      },
    ],
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'helvetia-med',
    client: 'Vireo BioSystems',
    sector: 'Medical Diagnostics',
    hub: 'Zurich Hub',
    delegates: 185,
    durationDays: 4,
    headlineMetric: '+38% Cross-Regional Deal Velocity in Q3',
    metricContext: 'Measured across 18 European & US commercial directors within 90 days post-summit',
    challenge:
      'Following a dual-continent acquisition, commercial leadership remained siloed across four time zones with stalled enterprise co-selling.',
    execution:
      'Meridian secured a full lakeside buyout in Zurich, structured 14 acoustically isolated deal-alignment sprints, and synchronized 185 business-class arrivals with zero missed sessions.',
    quote:
      'Before working with Meridian, our leadership offsites lost half a day to fragmented hotel transfers and AV failures. In Zurich, every minute from tarmac to closing dinner ran silently, helping our merged sales directors close three stalled hospital networks before quarter-end.',
    authorName: 'Henrik Lindqvist',
    authorRole: 'Chief Operating Officer, Vireo BioSystems',
  },
  {
    id: 'pacific-cloud',
    client: 'Kestrel Cloud Infrastructure',
    sector: 'Enterprise Software',
    hub: 'Singapore Hub',
    delegates: 420,
    durationDays: 3,
    headlineMetric: '98.6% Post-Summit Delegate Satisfaction',
    metricContext: '420 attendees from 14 APAC markets · 100% live stream uptime to San Francisco HQ',
    challenge:
      'Needed to host a high-security annual partner summit in Singapore with simultaneous investor roundtables and strict diplomatic arrival windows.',
    execution:
      'Coordinated Changi VIP clearance, Marina Bay plenary staging, and 20 soundproof partner briefing suites under a single consolidated ledger.',
    quote:
      'Replacing three separate regional agencies with Meridian cut our internal planning hours by more than half and raised partner attendance to an all-time record for our APAC forum.',
    authorName: 'Mei-Ling Tan',
    authorRole: 'VP of Global Field Marketing, Kestrel Cloud',
  },
  {
    id: 'iberian-fintech',
    client: 'Nordic Clearing Group',
    sector: 'Institutional Finance',
    hub: 'Barcelona Hub',
    delegates: 260,
    durationDays: 3,
    headlineMetric: '31% Lower Charter & Transfer Overhead',
    metricContext: 'Audited against prior-year Stockholm & Frankfurt multi-vendor spend',
    challenge:
      'Rising airfare volatility and fragmented ground vendors previously drove 24% budget overruns during the annual client symposium.',
    execution:
      'Consolidated contracted EMEA flight blocks into BCN, deployed a unified electric coach fleet, and pre-negotiated VAT-recoverable venue contracts.',
    quote:
      'Meridian gave our finance committee exact line-item predictability four months in advance and delivered an architectural Barcelona forum our institutional clients still reference.',
    authorName: 'Claire-Marie Dubois',
    authorRole: 'Head of Corporate Affairs, Nordic Clearing Group',
  },
];

export const PROGRAM_MULTIPLIERS: Record<
  ProgramType,
  { label: string; factor: number; description: string }
> = {
  'Executive Retreat': {
    label: 'Executive Retreat',
    factor: 1.12,
    description: 'High-privacy buyouts, boardroom AV, private dining & executive protocol.',
  },
  'Business & Leisure Stay': {
    label: 'Business & Leisure Stay',
    factor: 0.94,
    description: '5-star executive rooms, private landmark tours & flexible concierge.',
  },
  'Sales Incentive': {
    label: 'Sales Incentive',
    factor: 1.18,
    description: 'Signature experiences, partner hospitality & recognition gala production.',
  },
  'Annual Summit': {
    label: 'Annual Summit',
    factor: 1.0,
    description: 'Main-stage plenary, multi-track breakouts & unified delegate logistics.',
  },
};

export const TIER_MULTIPLIERS: Record<HospitalityTier, number> = {
  Executive: 1.0,
  'Boardroom Luxury': 1.35,
};

export const DEFAULT_CUSTOMER_PROFILE: CustomerProfile = {
  name: 'Elena Vance',
  email: 'elena.vance@nordicclearing.com',
  company: 'Nordic Clearing Group',
};

export const INITIAL_CUSTOMER_BOOKINGS: CustomerBooking[] = [
  {
    id: 'bk-seed-1',
    referenceCode: 'MC-CDG-4812',
    customerName: 'Elena Vance',
    customerEmail: 'elena.vance@nordicclearing.com',
    company: 'Nordic Clearing Group',
    hubId: 'paris',
    city: 'Paris',
    country: 'France',
    airportCode: 'CDG',
    programType: 'Executive Retreat',
    tier: 'Boardroom Luxury',
    checkInDate: '2027-04-12',
    checkOutDate: '2027-04-15',
    nights: 3,
    guests: 24,
    totalUsd: 104544,
    status: 'Confirmed',
    createdAt: '2026-11-18',
    specialRequests: 'Private Seine boat transfer on evening of Day 1; 2 vegan tasting menus.',
  },
  {
    id: 'bk-seed-2',
    referenceCode: 'MC-DXB-7390',
    customerName: 'Elena Vance',
    customerEmail: 'elena.vance@nordicclearing.com',
    company: 'Nordic Clearing Group',
    hubId: 'dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    airportCode: 'DXB',
    programType: 'Business & Leisure Stay',
    tier: 'Executive',
    checkInDate: '2027-02-04',
    checkOutDate: '2027-02-07',
    nights: 3,
    guests: 8,
    totalUsd: 20078,
    status: 'Confirmed',
    createdAt: '2026-11-10',
    specialRequests: 'Al Majlis DXB fast-track arrival for all 8 partners.',
  },
  {
    id: 'bk-seed-3',
    referenceCode: 'MC-ZRH-2104',
    customerName: 'Elena Vance',
    customerEmail: 'elena.vance@nordicclearing.com',
    company: 'Nordic Clearing Group',
    hubId: 'zurich',
    city: 'Zurich',
    country: 'Switzerland',
    airportCode: 'ZRH',
    programType: 'Annual Summit',
    tier: 'Executive',
    checkInDate: '2026-09-14',
    checkOutDate: '2026-09-17',
    nights: 3,
    guests: 45,
    totalUsd: 124200,
    status: 'Completed',
    createdAt: '2026-06-22',
  },
];

export function calculateCancellationPolicy(
  checkInDate: string,
  totalUsd: number
): {
  refundPercent: number;
  refundUsd: number;
  policyLabel: string;
} {
  const now = new Date();
  const checkIn = new Date(checkInDate + 'T00:00:00');
  const diffMs = checkIn.getTime() - now.getTime();
  const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (!Number.isFinite(daysUntil)) {
    return {
      refundPercent: 0,
      refundUsd: 0,
      policyLabel: 'Standard corporate review applies',
    };
  }

  if (daysUntil >= 14) {
    return {
      refundPercent: 100,
      refundUsd: totalUsd,
      policyLabel: 'Full 100% refund (14+ days before check-in)',
    };
  }
  if (daysUntil >= 7) {
    return {
      refundPercent: 50,
      refundUsd: Math.round(totalUsd * 0.5),
      policyLabel: '50% partial refund (7–13 days before check-in)',
    };
  }
  return {
    refundPercent: 0,
    refundUsd: 0,
    policyLabel: 'Travel credit eligible only (under 7 days to check-in)',
  };
}

export type EmployeeDepartment =
  | 'Operations & Protocol'
  | 'Client Concierge'
  | 'Aviation & Logistics'
  | 'Production & AV';

export type EmploymentType = 'Full-Time' | 'Contract';

export interface EmployeeRecord {
  id: string;
  name: string;
  role: string;
  department: EmployeeDepartment;
  hubCity: string;
  employmentType: EmploymentType;
  hourlyRateUsd: number;
  weeklyHours: number;
  joinedDate: string;
}

export interface MonthlyBaseline {
  month: string;
  baseRevenueUsd: number;
  directCogsRatio: number;
  fixedLeaseUsd: number;
}

export const INITIAL_EMPLOYEES: EmployeeRecord[] = [
  {
    id: 'emp-1',
    name: 'Lukas Meier',
    role: 'Senior Summit Producer',
    department: 'Operations & Protocol',
    hubCity: 'Zurich',
    employmentType: 'Full-Time',
    hourlyRateUsd: 78,
    weeklyHours: 40,
    joinedDate: '2023-03-15',
  },
  {
    id: 'emp-2',
    name: 'Camille Laurent',
    role: 'Client Hospitality Lead',
    department: 'Client Concierge',
    hubCity: 'Paris',
    employmentType: 'Full-Time',
    hourlyRateUsd: 64,
    weeklyHours: 40,
    joinedDate: '2024-01-10',
  },
  {
    id: 'emp-3',
    name: 'Tariq Al-Mansoor',
    role: 'VIP Terminal & Charter Coordinator',
    department: 'Aviation & Logistics',
    hubCity: 'Dubai',
    employmentType: 'Full-Time',
    hourlyRateUsd: 72,
    weeklyHours: 42,
    joinedDate: '2023-08-01',
  },
  {
    id: 'emp-4',
    name: 'Marcus Sterling',
    role: 'Plenary Broadcast Director',
    department: 'Production & AV',
    hubCity: 'New York',
    employmentType: 'Full-Time',
    hourlyRateUsd: 84,
    weeklyHours: 40,
    joinedDate: '2022-11-20',
  },
  {
    id: 'emp-5',
    name: 'Sora Takahashi',
    role: 'Executive Retreat Concierge',
    department: 'Client Concierge',
    hubCity: 'Kyoto',
    employmentType: 'Full-Time',
    hourlyRateUsd: 58,
    weeklyHours: 38,
    joinedDate: '2024-05-06',
  },
  {
    id: 'emp-6',
    name: 'Amelia Bennett',
    role: 'Thames & LHR Ground Lead',
    department: 'Operations & Protocol',
    hubCity: 'London',
    employmentType: 'Full-Time',
    hourlyRateUsd: 66,
    weeklyHours: 40,
    joinedDate: '2023-10-12',
  },
  {
    id: 'emp-7',
    name: 'Wei-Jie Lim',
    role: 'APAC Aviation Dispatch Specialist',
    department: 'Aviation & Logistics',
    hubCity: 'Singapore',
    employmentType: 'Contract',
    hourlyRateUsd: 62,
    weeklyHours: 32,
    joinedDate: '2025-02-14',
  },
  {
    id: 'emp-8',
    name: 'Mateo Puig',
    role: 'Stage & Acoustic Systems Engineer',
    department: 'Production & AV',
    hubCity: 'Barcelona',
    employmentType: 'Contract',
    hourlyRateUsd: 59,
    weeklyHours: 30,
    joinedDate: '2025-04-01',
  },
];

export const MONTHLY_BASELINES: MonthlyBaseline[] = [
  { month: 'Jun 2026', baseRevenueUsd: 342000, directCogsRatio: 0.54, fixedLeaseUsd: 38000 },
  { month: 'Jul 2026', baseRevenueUsd: 318000, directCogsRatio: 0.54, fixedLeaseUsd: 38000 },
  { month: 'Aug 2026', baseRevenueUsd: 295000, directCogsRatio: 0.55, fixedLeaseUsd: 38000 },
  { month: 'Sep 2026', baseRevenueUsd: 410000, directCogsRatio: 0.52, fixedLeaseUsd: 38000 },
  { month: 'Oct 2026', baseRevenueUsd: 446000, directCogsRatio: 0.52, fixedLeaseUsd: 38000 },
  { month: 'Nov 2026', baseRevenueUsd: 385000, directCogsRatio: 0.52, fixedLeaseUsd: 38000 },
];

