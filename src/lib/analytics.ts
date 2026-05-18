import "server-only";

import type { CallRecord, Lead } from "./types";

function average(values: number[]) {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function percent(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

function topEntries<T extends { count?: number; score?: number; share?: number }>(
  entries: T[],
  limit: number,
) {
  return entries
    .sort(
      (left, right) =>
        (right.count ?? right.share ?? right.score ?? 0) -
        (left.count ?? left.share ?? left.score ?? 0),
    )
    .slice(0, limit);
}

export function getObjectionTrends(calls: CallRecord[]) {
  const counts = new Map<string, number>();

  for (const call of calls) {
    for (const objection of call.objections) {
      const label = objection.trim();
      if (!label) continue;
      counts.set(label, (counts.get(label) ?? 0) + 1);
    }
  }

  const total = Array.from(counts.values()).reduce((sum, value) => sum + value, 0);
  if (!total) {
    return [{ label: "No objections detected yet", count: 0, share: 0 }];
  }

  return topEntries(
    Array.from(counts.entries()).map(([label, count]) => ({
      label,
      count,
      share: percent(count, total),
    })),
    5,
  );
}

export function getSourcePerformance(leads: Lead[]) {
  const groups = new Map<string, Lead[]>();

  for (const lead of leads) {
    const source = lead.source || "Unknown";
    groups.set(source, [...(groups.get(source) ?? []), lead]);
  }

  if (!groups.size) {
    return [{ source: "No leads yet", leads: 0, score: 0, hotRate: "0%" }];
  }

  return topEntries(
    Array.from(groups.entries()).map(([source, sourceLeads]) => {
      const hotCount = sourceLeads.filter((lead) => lead.classification === "Hot").length;

      return {
        source,
        leads: sourceLeads.length,
        score: average(sourceLeads.map((lead) => lead.conversionScore)),
        hotRate: `${percent(hotCount, sourceLeads.length)}%`,
      };
    }),
    6,
  );
}

export function getCityPerformance(leads: Lead[]) {
  const groups = new Map<string, Lead[]>();

  for (const lead of leads) {
    const city = lead.city || "Unknown";
    groups.set(city, [...(groups.get(city) ?? []), lead]);
  }

  if (!groups.size) {
    return [{ city: "No city data yet", leads: 0, score: 0 }];
  }

  return topEntries(
    Array.from(groups.entries()).map(([city, cityLeads]) => ({
      city,
      leads: cityLeads.length,
      score: average(cityLeads.map((lead) => lead.conversionScore)),
    })),
    6,
  );
}

export function getLanguagePerformance(calls: CallRecord[]) {
  const groups = new Map<string, CallRecord[]>();

  for (const call of calls) {
    groups.set(call.languageUsed, [...(groups.get(call.languageUsed) ?? []), call]);
  }

  if (!groups.size) {
    return [{ language: "No calls analyzed yet", connected: 0, score: 0 }];
  }

  return topEntries(
    Array.from(groups.entries()).map(([language, languageCalls]) => ({
      language,
      connected: languageCalls.filter((call) => call.callStatus === "Connected").length,
      score: average(languageCalls.map((call) => call.conversionScore)),
    })),
    4,
  );
}

const slotDefinitions = [
  { slot: "10 AM - 12 PM", start: 10, end: 12 },
  { slot: "12 PM - 2 PM", start: 12, end: 14 },
  { slot: "3 PM - 5 PM", start: 15, end: 17 },
  { slot: "5 PM - 7 PM", start: 17, end: 19 },
];

export function getTimeOfDayPerformance(calls: CallRecord[]) {
  return slotDefinitions.map(({ slot, start, end }) => {
    const slotCalls = calls.filter((call) => {
      const hour = new Date(call.createdAt).getHours();
      return hour >= start && hour < end;
    });
    const connected = slotCalls.filter((call) => call.callStatus === "Connected").length;

    return {
      slot,
      rate: percent(connected, slotCalls.length),
    };
  });
}
