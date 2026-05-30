"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import JapanMap from "@/components/JapanMap";
import type { ShuzoHistory } from "@/lib/temperature";

export default function HistoryPage() {
  const [data, setData] = useState<ShuzoHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => {
        if (!res.ok) throw new Error("データの取得に失敗しました");
        return res.json();
      })
      .then((result) => setData(result))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* ヘッダー */}
      <header className="p-4 flex items-center justify-between border-b border-gray-700">
        <h1 className="text-xl md:text-2xl font-bold">
          🗾 修造出没マップ（過去30日間）
        </h1>
        <Link
          href="/"
          className="text-sm bg-white/10 hover:bg-white/20 rounded-full px-4 py-2 transition-colors"
        >
          ← 今日のデータ
        </Link>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        {loading && (
          <p className="text-lg text-gray-400 animate-pulse">読み込み中...</p>
        )}

        {error && <p className="text-lg text-red-400">{error}</p>}

        {data && !loading && (
          <div className="w-full max-w-3xl">
            <JapanMap data={data} />

            {/* 凡例 */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
              <span className="text-gray-400">出現回数:</span>
              {[
                { color: "#e5e7eb", label: "0回" },
                { color: "#fecaca", label: "1-2回" },
                { color: "#fca5a5", label: "3-4回" },
                { color: "#f87171", label: "5-6回" },
                { color: "#ef4444", label: "7回以上" },
              ].map((item) => (
                <span key={item.label} className="flex items-center gap-1">
                  <span
                    className="inline-block w-4 h-4 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.label}
                </span>
              ))}
            </div>

            {/* ランキング */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {Object.entries(data)
                .filter(([, count]) => count > 0)
                .sort(([, a], [, b]) => b - a)
                .map(([name, count]) => (
                  <div
                    key={name}
                    className="flex justify-between bg-white/5 rounded px-3 py-2"
                  >
                    <span>{name}</span>
                    <span className="font-bold text-red-400">{count}回</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
