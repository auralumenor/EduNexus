/** Format a date string to locale format */
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

/** Truncate text to a max length */
export const truncate = (str: string, max = 80) =>
  str.length > max ? str.slice(0, max) + '…' : str;

/** Generate a hue from a string (for avatar colors) */
export const stringToHue = (str: string) =>
  str.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 360;

/** Calculate overdue days from a due date */
export const overdueDays = (dueDate: string) => {
  const now = Date.now();
  const due = new Date(dueDate).getTime();
  return Math.max(0, Math.ceil((now - due) / (1000 * 60 * 60 * 24)));
};
