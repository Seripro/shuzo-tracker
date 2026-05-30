export type PrefectureTemp = {
  name: string;
  yesterdayMax: number;
  todayMax: number;
  diff: number;
};

export type TemperatureResult = {
  hottest: PrefectureTemp;
  coldest: PrefectureTemp;
  fetchedAt: string;
};

const PREFECTURES: { name: string; lat: number; lon: number }[] = [
  { name: "北海道", lat: 43.06, lon: 141.35 },
  { name: "青森県", lat: 40.82, lon: 140.74 },
  { name: "岩手県", lat: 39.7, lon: 141.15 },
  { name: "宮城県", lat: 38.27, lon: 140.87 },
  { name: "秋田県", lat: 39.72, lon: 140.1 },
  { name: "山形県", lat: 38.24, lon: 140.33 },
  { name: "福島県", lat: 37.75, lon: 140.47 },
  { name: "茨城県", lat: 36.34, lon: 140.45 },
  { name: "栃木県", lat: 36.57, lon: 139.88 },
  { name: "群馬県", lat: 36.39, lon: 139.06 },
  { name: "埼玉県", lat: 35.86, lon: 139.65 },
  { name: "千葉県", lat: 35.61, lon: 140.12 },
  { name: "東京都", lat: 35.68, lon: 139.69 },
  { name: "神奈川県", lat: 35.45, lon: 139.64 },
  { name: "新潟県", lat: 37.9, lon: 139.02 },
  { name: "富山県", lat: 36.7, lon: 137.21 },
  { name: "石川県", lat: 36.59, lon: 136.63 },
  { name: "福井県", lat: 36.07, lon: 136.22 },
  { name: "山梨県", lat: 35.66, lon: 138.57 },
  { name: "長野県", lat: 36.23, lon: 138.18 },
  { name: "岐阜県", lat: 35.39, lon: 136.72 },
  { name: "静岡県", lat: 34.98, lon: 138.38 },
  { name: "愛知県", lat: 35.18, lon: 136.91 },
  { name: "三重県", lat: 34.73, lon: 136.51 },
  { name: "滋賀県", lat: 35.0, lon: 135.87 },
  { name: "京都府", lat: 35.02, lon: 135.76 },
  { name: "大阪府", lat: 34.69, lon: 135.52 },
  { name: "兵庫県", lat: 34.69, lon: 135.18 },
  { name: "奈良県", lat: 34.69, lon: 135.83 },
  { name: "和歌山県", lat: 34.23, lon: 135.17 },
  { name: "鳥取県", lat: 35.5, lon: 134.24 },
  { name: "島根県", lat: 35.47, lon: 133.05 },
  { name: "岡山県", lat: 34.66, lon: 133.93 },
  { name: "広島県", lat: 34.4, lon: 132.46 },
  { name: "山口県", lat: 34.19, lon: 131.47 },
  { name: "徳島県", lat: 34.07, lon: 134.56 },
  { name: "香川県", lat: 34.34, lon: 134.04 },
  { name: "愛媛県", lat: 33.84, lon: 132.77 },
  { name: "高知県", lat: 33.56, lon: 133.53 },
  { name: "福岡県", lat: 33.61, lon: 130.42 },
  { name: "佐賀県", lat: 33.25, lon: 130.3 },
  { name: "長崎県", lat: 32.74, lon: 129.87 },
  { name: "熊本県", lat: 32.79, lon: 130.74 },
  { name: "大分県", lat: 33.24, lon: 131.61 },
  { name: "宮崎県", lat: 31.91, lon: 131.42 },
  { name: "鹿児島県", lat: 31.56, lon: 130.56 },
  { name: "沖縄県", lat: 26.21, lon: 127.68 },
];

export type ShuzoHistory = Record<string, number>;

export async function getShuzoHistoryLast30Days(): Promise<ShuzoHistory> {
  const formatDateJst = (d: Date) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);

  const today = new Date();
  const startDay = new Date(today);
  startDay.setDate(today.getDate() - 30);

  const startDate = formatDateJst(startDay);
  const endDate = formatDateJst(today);

  const latitudes = PREFECTURES.map((p) => p.lat).join(",");
  const longitudes = PREFECTURES.map((p) => p.lon).join(",");

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitudes}&longitude=${longitudes}&daily=temperature_2m_max&start_date=${startDate}&end_date=${endDate}&timezone=Asia%2FTokyo`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Open-Meteo API error: ${res.status}`);
  }

  const data = await res.json();

  const allTemps: { name: string; maxTemps: number[] }[] = PREFECTURES.map(
    (pref, i) => {
      const daily = Array.isArray(data) ? data[i].daily : data.daily;
      return { name: pref.name, maxTemps: daily.temperature_2m_max };
    },
  );

  const counts: ShuzoHistory = {};
  for (const pref of PREFECTURES) {
    counts[pref.name] = 0;
  }

  const numDays = allTemps[0].maxTemps.length;
  for (let dayIdx = 1; dayIdx < numDays; dayIdx++) {
    let maxDiff = -Infinity;
    let maxPref = "";

    for (const pref of allTemps) {
      const prev = pref.maxTemps[dayIdx - 1];
      const curr = pref.maxTemps[dayIdx];
      if (prev == null || curr == null) continue;
      const diff = curr - prev;
      if (diff > maxDiff) {
        maxDiff = diff;
        maxPref = pref.name;
      }
    }

    if (maxPref) {
      counts[maxPref]++;
    }
  }

  return counts;
}

export async function getTemperatureRanking(
  targetDate?: string,
): Promise<TemperatureResult> {
  const formatDateJst = (d: Date) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);

  const targetDateString = targetDate ?? formatDateJst(new Date());
  const target = new Date(`${targetDateString}T00:00:00+09:00`);
  const previous = new Date(target);
  previous.setDate(target.getDate() - 1);

  const startDate = formatDateJst(previous);
  const endDate = formatDateJst(target);

  const latitudes = PREFECTURES.map((p) => p.lat).join(",");
  const longitudes = PREFECTURES.map((p) => p.lon).join(",");

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitudes}&longitude=${longitudes}&daily=temperature_2m_max&start_date=${startDate}&end_date=${endDate}&timezone=Asia%2FTokyo`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Open-Meteo API error: ${res.status}`);
  }

  const data = await res.json();

  const results = PREFECTURES.map((pref, i): PrefectureTemp | null => {
    const daily = Array.isArray(data) ? data[i].daily : data.daily;
    const maxTemps: number[] = daily.temperature_2m_max;
    const yesterdayMax = maxTemps[0] ?? null;
    const todayMax = maxTemps[1] ?? null;

    if (yesterdayMax === null || todayMax === null) {
      return null;
    }

    return {
      name: pref.name,
      yesterdayMax,
      todayMax,
      diff: todayMax - yesterdayMax,
    };
  }).filter((result): result is PrefectureTemp => result !== null);

  if (results.length === 0) {
    throw new Error("有効な気温データが取得できませんでした");
  }

  results.sort((a, b) => b.diff - a.diff);

  return {
    hottest: results[0],
    coldest: results[results.length - 1],
    fetchedAt: new Date().toISOString(),
  };
}
