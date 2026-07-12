/**
 * @fileoverview Stadium mapping data, gate coordinates, and live queue statuses.
 * Shared between ServiceDirectory and VectorPitchMap components.
 */

export const gateQueueInfo = {
  "gate-a": { name: "Gate A (North)", crowd: "low", percentage: 15, color: "#166534", description: "Clear lines, under 2 min wait", wait: 2 },
  "gate-b": { name: "Gate B (South-East)", crowd: "moderate", percentage: 48, color: "#a16207", description: "Steady inflow, 5-8 min wait", wait: 6 },
  "gate-c": { name: "Gate C (East)", crowd: "high", percentage: 82, color: "#dc2626", description: "Heavy bottleneck, 15-20 min wait", wait: 18 },
  "gate-d": { name: "Gate D (South)", crowd: "low", percentage: 25, color: "#166534", description: "Smooth entry, under 3 min wait", wait: 3 },
  "gate-e": { name: "Gate E (West)", crowd: "moderate", percentage: 55, color: "#a16207", description: "Standard security lines, 6-9 min wait", wait: 8 },
  "gate-f": { name: "Gate F (North-West)", crowd: "moderate", percentage: 58, color: "#a16207", description: "Steady inflow, 8-12 min wait", wait: 10 },
  "gate-g": { name: "Gate G (West-North)", crowd: "low", percentage: 30, color: "#166534", description: "Clear lines, under 4 min wait", wait: 4 },
  "gate-h": { name: "Gate H (North-East)", crowd: "high", percentage: 89, color: "#dc2626", description: "Heavy delays, use adjacent Gate A if possible", wait: 25 }
};

export const spots = {
  gateC: { x: 380, y: 320, label: 'Gate C' },
  gateD: { x: 500, y: 150, label: 'Gate D' },
  gateB: { x: 120, y: 180, label: 'Gate B' },
  block102: { x: 260, y: 220, label: 'Section 102' },
  block104: { x: 380, y: 180, label: 'Section 104' },
  medicalBay: { x: 150, y: 280, label: 'Medical Bay' }
};

export const gateCoordinates = {
  "gate-a": { cx: 0, cy: -184 },
  "gate-b": { cx: 130, cy: -130 },
  "gate-c": { cx: 184, cy: 0 },
  "gate-d": { cx: 130, cy: 130 },
  "gate-e": { cx: 0, cy: 184 },
  "gate-f": { cx: -130, cy: 130 },
  "gate-g": { cx: -184, cy: 0 },
  "gate-h": { cx: -130, cy: -130 }
};
