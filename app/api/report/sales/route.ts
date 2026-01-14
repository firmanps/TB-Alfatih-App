import { NextResponse } from "next/server";

type FilterKey = "month" | "year";

type SummaryItem = {
  key: "revenue" | "transactions" | "avgOrder" | "newCustomers";
  value: number;
  changePct: number; // misal 9.4 = +9.4%
};

type BestProduct = {
  name: string;
  revenueJt: number; // dalam juta
  percent: number; // 0-100
};

type Transaction = {
  id: string;
  customer: string;
  product: string;
  dateISO: string; // ISO supaya gampang diformat di FE
  amount: number; // rupiah
  status: "Selesai" | "Pending" | "Batal";
};

type ChartPoint = { name: string; total: number };

function toIDR(n: number) {
  return n.toLocaleString("id-ID");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const mode = (searchParams.get("mode") ?? "month") as FilterKey;
  const year = Number(searchParams.get("year") ?? "2024");
  const month = Number(searchParams.get("month") ?? "1"); // 1-12 untuk mode bulanan

  // === DUMMY SERVER DATA (TOKO BANGUNAN) ===
  const summary: SummaryItem[] = [
    { key: "revenue", value: 312_500_000, changePct: 9.4 },
    { key: "transactions", value: 1284, changePct: 6.1 },
    { key: "avgOrder", value: 243_000, changePct: -1.3 },
    { key: "newCustomers", value: 218, changePct: 14.8 },
  ];

  const bestProducts: BestProduct[] = [
    { name: "Semen 50kg", revenueJt: 86, percent: 27 },
    { name: "Besi Beton 10mm", revenueJt: 64, percent: 20 },
    { name: "Cat Tembok 5L", revenueJt: 52, percent: 16 },
    { name: "Keramik 40×40", revenueJt: 39, percent: 12 },
    { name: "Paku & Baut (mix)", revenueJt: 28, percent: 9 },
  ];

  const latestTransactions: Transaction[] = [
    {
      id: "TRX001",
      customer: "Ahmad Fauzi",
      product: "Semen 50kg (20 sak)",
      dateISO: "2024-01-14T10:10:00.000Z",
      amount: 1_520_000,
      status: "Selesai",
    },
    {
      id: "TRX002",
      customer: "Siti Rahayu",
      product: "Cat Tembok 5L (2 pcs)",
      dateISO: "2024-01-14T09:22:00.000Z",
      amount: 460_000,
      status: "Selesai",
    },
    {
      id: "TRX003",
      customer: "Budi Santoso",
      product: "Besi Beton 10mm (12 batang)",
      dateISO: "2024-01-13T15:01:00.000Z",
      amount: 1_080_000,
      status: "Pending",
    },
    {
      id: "TRX004",
      customer: "Dewi Lestari",
      product: "Keramik 40×40 (10 dus)",
      dateISO: "2024-01-13T11:44:00.000Z",
      amount: 1_250_000,
      status: "Selesai",
    },
    {
      id: "TRX005",
      customer: "Rizki Firmansyah",
      product: "Paku & Baut (paket)",
      dateISO: "2024-01-12T08:30:00.000Z",
      amount: 175_000,
      status: "Selesai",
    },
  ];

  const monthlyChart: ChartPoint[] = [
    { name: "Jan", total: 18 },
    { name: "Feb", total: 22 },
    { name: "Mar", total: 20 },
    { name: "Apr", total: 24 },
    { name: "Mei", total: 28 },
    { name: "Jun", total: 21 },
    { name: "Jul", total: 30 },
    { name: "Agu", total: 33 },
    { name: "Sep", total: 29 },
    { name: "Okt", total: 35 },
    { name: "Nov", total: 27 },
    { name: "Des", total: 32 },
  ];

  const yearlyChart: ChartPoint[] = [
    { name: "2020", total: 210 },
    { name: "2021", total: 245 },
    { name: "2022", total: 278 },
    { name: "2023", total: 301 },
    { name: "2024", total: 312 },
  ];

  const chart = mode === "month" ? monthlyChart : yearlyChart;
  const counts =
    mode === "month" ? [0, 10, 20, 30, 40] : [0, 100, 200, 300, 400];

  return NextResponse.json({
    ok: true,
    filter: {
      mode,
      label: mode === "month" ? "Bulanan" : "Tahunan",
      year,
      month,
    },
    summary,
    chart,
    counts,
    bestProducts,
    latestTransactions,
    // kalau butuh text siap pakai
    format: {
      revenue: `Rp ${toIDR(summary.find((s) => s.key === "revenue")!.value)}`,
    },
  });
}
