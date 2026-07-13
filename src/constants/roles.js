/**
 * @fileoverview Application-wide constants for user roles.
 * Centralises role identifiers to prevent magic strings throughout the codebase.
 */

/** @readonly @enum {string} */
export const ROLES = {
  FAN: 'Fan',
  VOLUNTEER: 'Volunteer',
  VENUE_STAFF: 'Venue Staff',
  ORGANIZER: 'Organizer',
};

/** Ordered list of roles for display in dropdowns */
export const ROLES_LIST = [
  { code: ROLES.FAN, label: 'Fan (Guest)' },
  { code: ROLES.VOLUNTEER, label: 'Volunteer' },
  { code: ROLES.VENUE_STAFF, label: 'Venue Staff' },
  { code: ROLES.ORGANIZER, label: 'Organizer (Command)' },
];
