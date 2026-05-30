import { getTemperatureRanking } from "@/lib/temperature";

export default async function Home() {
  const { hottest, coldest, fetchedAt } = await getTemperatureRanking();

  return (
    <div className="flex flex-1 flex-col md:flex-row min-h-screen">
      {/* 気温上昇セクション */}
      <section className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-red-500 to-orange-400 p-8 text-white">
        <p className="text-lg md:text-xl font-medium opacity-80 mb-2">
          🔥 修造が来た県
        </p>
        <h2 className="text-4xl md:text-6xl font-black mb-4">{hottest.name}</h2>
        <p className="text-6xl md:text-8xl font-black tracking-tight">
          +{hottest.diff.toFixed(1)}℃
        </p>
        <div className="mt-6 flex gap-6 text-lg md:text-xl opacity-90">
          <span>昨日 {hottest.yesterdayMax.toFixed(1)}℃</span>
          <span>→</span>
          <span>今日 {hottest.todayMax.toFixed(1)}℃</span>
        </div>
      </section>

      {/* 気温下降セクション */}
      <section className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-400 p-8 text-white">
        <p className="text-lg md:text-xl font-medium opacity-80 mb-2">
          🧊 修造が去った県
        </p>
        <h2 className="text-4xl md:text-6xl font-black mb-4">{coldest.name}</h2>
        <p className="text-6xl md:text-8xl font-black tracking-tight">
          {coldest.diff.toFixed(1)}℃
        </p>
        <div className="mt-6 flex gap-6 text-lg md:text-xl opacity-90">
          <span>昨日 {coldest.yesterdayMax.toFixed(1)}℃</span>
          <span>→</span>
          <span>今日 {coldest.todayMax.toFixed(1)}℃</span>
        </div>
      </section>

      {/* フッター */}
      <footer className="absolute bottom-4 left-0 right-0 text-center text-xs text-white/60">
        取得時刻: {new Date(fetchedAt).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}
      </footer>
    </div>
  );
}
