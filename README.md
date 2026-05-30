# 修造トラッカー

松岡修造の移動経路を気温差から特定するアプリです。

日本全国47都道府県の「昨日と今日の最高気温の差」を計算し、最も気温が上がった県＝修造が来た県、最も下がった県＝修造が去った県として表示します。

## 機能

- **観測情報バナー** — 選択日の修造所在地を表示
- **気温上昇/下降の2分割表示** — 前日比の温度差を表示
- **日付選択** — カレンダーで過去の日付を選ぶとデータが切り替わる
- **出没マップ** (`/history`) — 過去30日間で修造が出現した県を日本地図上にヒートマップ表示

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS 4
- **気象データ**: [Open-Meteo API](https://open-meteo.com/)
- **地図**: react-simple-maps + TopoJSON

## セットアップ

```bash
# 依存パッケージのインストール
npm install --legacy-peer-deps

# 開発サーバーの起動
npm run dev
```

http://localhost:3000 でアクセスできます。

## プロジェクト構成

```
app/
├── page.tsx              # トップページ（日付選択 + 気温差表示）
├── history/page.tsx      # 出没マップページ
├── api/
│   ├── temperature/route.ts  # 気温データAPI
│   └── history/route.ts      # 過去30日集計API
├── layout.tsx
└── globals.css
components/
└── JapanMap.tsx          # 日本地図ヒートマップコンポーネント
lib/
└── temperature.ts        # Open-Meteo APIからのデータ取得・計算ロジック
public/
└── japan.topojson        # 日本地図TopoJSONデータ
```

## API仕様

### GET /api/temperature

指定日の気温差ランキングを取得。

| パラメータ | 型 | 説明 |
|---|---|---|
| `date` | string (YYYY-MM-DD) | 対象日（省略時は今日） |

### GET /api/history

過去30日間の県別出現回数を取得

## デプロイ

Vercelへデプロイしています

