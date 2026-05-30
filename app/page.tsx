"use client";

import { useEffect, useState } from "react";
import type { TemperatureResult } from "@/lib/temperature";

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatTemperature(value: number | null): string {
  return value === null ? "N/A" : value.toFixed(1);
}

export default function Home() {
  const [date, setDate] = useState(() => formatDate(new Date()));
  const [data, setData] = useState<TemperatureResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/temperature?date=${date}`)
      .then((res) => {
        if (!res.ok) throw new Error("データの取得に失敗しました");
        return res.json();
      })
      .then((result) => setData(result))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [date]);

  return (
    <div className="flex flex-1 flex-col min-h-screen relative">
      {/* 日付セレクター */}
      <div className="absolute top-4 left-0 right-0 z-10 flex justify-center">
        <input
          type="date"
          value={date}
          max={formatDate(new Date())}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-full bg-white/90 backdrop-blur px-4 py-2 text-sm font-medium text-gray-800 shadow-lg border border-gray-200 cursor-pointer"
        />
      </div>

      {loading && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-lg text-gray-500 animate-pulse">読み込み中...</p>
        </div>
      )}

      {error && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-lg text-red-500">{error}</p>
        </div>
      )}

      {data && !loading && (
        <div className="flex flex-1 flex-col md:flex-row">
          {/* 気温上昇セクション */}
          <section className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-red-500 to-orange-400 p-8 text-white">
            <p className="text-lg md:text-xl font-medium opacity-80 mb-2">
              🔥 修造が来た県
            </p>
            <h2 className="text-4xl md:text-6xl font-black mb-4">
              {data.hottest.name}
            </h2>
            <p className="text-6xl md:text-8xl font-black tracking-tight">
              +{data.hottest.diff.toFixed(1)}℃
            </p>
            <div className="mt-6 flex gap-6 text-lg md:text-xl opacity-90">
              <span>昨日 {formatTemperature(data.hottest.yesterdayMax)}℃</span>
              <span>→</span>
              <span>今日 {formatTemperature(data.hottest.todayMax)}℃</span>
            </div>
          </section>

          {/* 気温下降セクション */}
          <section className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-400 p-8 text-white">
            <p className="text-lg md:text-xl font-medium opacity-80 mb-2">
              🧊 修造が去った県
            </p>
            <h2 className="text-4xl md:text-6xl font-black mb-4">
              {data.coldest.name}
            </h2>
            <p className="text-6xl md:text-8xl font-black tracking-tight">
              {data.coldest.diff.toFixed(1)}℃
            </p>
            <div className="mt-6 flex gap-6 text-lg md:text-xl opacity-90">
              <span>昨日 {formatTemperature(data.coldest.yesterdayMax)}℃</span>
              <span>→</span>
              <span>今日 {formatTemperature(data.coldest.todayMax)}℃</span>
            </div>
          </section>
        </div>
      )}

      {/* フッター */}
      {data && !loading && (
        <footer className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/60">
          取得時刻:{" "}
          {new Date(data.fetchedAt).toLocaleString("ja-JP", {
            timeZone: "Asia/Tokyo",
          })}
        </footer>
      )}
    </div>
  );
}
