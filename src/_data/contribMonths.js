// Monthly totals of the contribution calendar, for the chart's table view.
const { days } = require("./stats.json");
const NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const byMonth = {};
for (const [date, count] of Object.entries(days)) {
  const key = date.slice(0, 7);
  byMonth[key] = byMonth[key] || { month: NAMES[+date.slice(5, 7) - 1], total: 0, activeDays: 0, peak: 0 };
  const m = byMonth[key];
  m.total += count;
  if (count > 0) m.activeDays += 1;
  m.peak = Math.max(m.peak, count);
}

module.exports = Object.keys(byMonth).sort().map((k) => byMonth[k]);
