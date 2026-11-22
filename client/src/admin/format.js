const dateFmt = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

export const formatDate = (iso) => (iso ? dateFmt.format(new Date(iso)) : '—');

const STATUS_LABELS = { active: 'Active', used: 'Used up', expired: 'Expired', revoked: 'Revoked' };
export const statusLabel = (s) => STATUS_LABELS[s] ?? s;
