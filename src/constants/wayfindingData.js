export const originalServicesData = [
  {
    id: "SRV-001",
    name: "Gate Ingress & Seat Navigation",
    category: "Stadium Logistics",
    department: "Steward & Ingress Ops",
    processingTime: "Gate E / Gate C recommended",
    requiredDocs: [
      { name: "Digital Match Ticket (Active)", key: "Ticket" },
      { name: "Government Photo ID (Aadhaar/Passport/Drivers License)", key: "ID" }
    ],
    eligibility: [
      "Must have a valid ticket for today's match",
      "Observe bag restrictions: clear plastic bags only under 12x6x12 inches"
    ],
    details: "Your seat in Section 104 is best accessed through Gate C. Clear security lines by preparing your mobile ticket for turnstile scanning.",
    website: "fifa.com/stadium-guides"
  },
  {
    id: "SRV-002",
    name: "North Lot Shuttle Line (Lot N)",
    category: "Transit & Shuttle Board",
    department: "MetLife Transit Authority",
    processingTime: "Continuous (Every 8 mins)",
    requiredDocs: [
      { name: "Transit Pass or Match Ticket QR", key: "Transit Pass" }
    ],
    eligibility: [
      "Open to all fans parked in Lot N or using the North Park-and-Ride facilities"
    ],
    details: "Shuttles run continuously from Gate A to the North Parking Lot. Wait times are currently running at 8-10 minutes.",
    website: "njtransit.com/fifa-2026"
  },
  {
    id: "SRV-003",
    name: "Metro Link Express Train",
    category: "Transit & Shuttle Board",
    department: "NJ Transit Corp",
    processingTime: "Every 4 mins (Post-match)",
    requiredDocs: [
      { name: "Metro / Train QR Transit Voucher", key: "Voucher" }
    ],
    eligibility: [
      "Valid for all ticket holders returning to Secaucus Junction or NYC Penn Station"
    ],
    details: "The Metro Link terminal is directly opposite Gate A. Express trains depart every 4 minutes immediately following the final whistle.",
    website: "njtransit.com/metro"
  },
  {
    id: "SRV-004",
    name: "ADA Assistive Cart Shuttle",
    category: "Accessibility & Health",
    department: "Guest Relations & Accessibility",
    processingTime: "On-demand dispatch",
    requiredDocs: [
      { name: "ADA Placard / Guest Registration", key: "ADA Verification" }
    ],
    eligibility: [
      "Fans with limited mobility, wheelchair requirements, or sensory sensitivities"
    ],
    details: "Electric cart transit is available on-demand from Lot E and Lot F parking areas directly to the closest accessible elevators.",
    website: "fifa.com/accessibility-metlife"
  },
  {
    id: "SRV-005",
    name: "Sensory Calm Room access",
    category: "Accessibility & Health",
    department: "Guest Relations & Accessibility",
    processingTime: "Open access (Level 1)",
    requiredDocs: [],
    eligibility: [
      "Fans experiencing sensory overload, autism-spectrum guests, and families needing a quiet space"
    ],
    details: "Sensory Calm Rooms are located near Section 112 on Concourse Level 1. Noise-cancelling headphones and weighted blankets are available.",
    website: "fifa.com/accessibility-metlife"
  },
  {
    id: "SRV-006",
    name: "Smart Cup Recycling Rewards",
    category: "Eco-Points Hub",
    department: "Sustainability & Eco-Partners",
    processingTime: "Instant Credit (+50 pts)",
    requiredDocs: [],
    eligibility: [
      "All stadium guests participating in the green cup return program"
    ],
    details: "Return your reusable official beverage cups to any Smart Bin or vendor counter to earn Eco-points or cash rewards.",
    website: "fifa.com/green-stadium"
  }
];
