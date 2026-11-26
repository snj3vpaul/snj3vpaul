import { useEffect, useState } from 'react';

/* The live Ottawa clock, and today's daylight from the NOAA sunrise equation (45.42°N, 75.70°W). */
const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', hour: '2-digit', minute: '2-digit', hour12: false });
const rad = Math.PI / 180, LAT = 45.4215, LON = -75.6972;
function sun(date: Date) {
  const n = Math.floor(+date / 864e5 + 2440587.5 - 2451545 + 0.0008) - LON / 360;
  const M = (357.5291 + 0.98560028 * n) % 360, C = 1.9148 * Math.sin(M * rad) + 0.02 * Math.sin(2 * M * rad) + 0.0003 * Math.sin(3 * M * rad);
  const L = (M + C + 180 + 102.9372) % 360, J = 2451545 + n + 0.0053 * Math.sin(M * rad) - 0.0069 * Math.sin(2 * L * rad);
  const dec = Math.asin(Math.sin(L * rad) * Math.sin(23.4397 * rad));
  const w = Math.acos((Math.sin(-0.833 * rad) - Math.sin(LAT * rad) * Math.sin(dec)) / (Math.cos(LAT * rad) * Math.cos(dec))) / rad;
  const at = (j: number) => new Date((j - 2440587.5) * 864e5);
  return [at(J - w / 360), at(J + w / 360)] as const;
}
const mins = (d: Date) => { const [h, m] = fmt.format(d).split(':').map(Number); return h * 60 + m; };

export type Daylight = { time: string; rise: string; set: string; dayLeft: number; dayWidth: number; now: number } | null;
export function useOttawaClock(): Daylight {
  const [v, setV] = useState<Daylight>(null);
  useEffect(() => {
    const tick = () => {
      const now = new Date(), [r, s] = sun(now);
      setV({ time: fmt.format(now), rise: fmt.format(r), set: fmt.format(s), dayLeft: mins(r) / 14.4, dayWidth: (mins(s) - mins(r)) / 14.4, now: mins(now) / 14.4 });
    };
    tick(); const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);
  return v;
}
