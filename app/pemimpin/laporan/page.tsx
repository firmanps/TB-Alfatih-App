"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DollarSign,
  Download,
  Filter,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type FilterKey = "month" | "year";

type SummaryItem = {
  key: "revenue" | "transactions" | "avgOrder" | "newCustomers";
  value: number;
  changePct: number;
};

type BestProduct = { name: string; revenueJt: number; percent: number };
type Transaction = {
  id: string;
  customer: string;
  product: string;
  dateISO: string;
  amount: number;
  status: "Selesai" | "Pending" | "Batal";
};
type ChartPoint = { name: string; total: number };

type ApiResponse = {
  ok: boolean;
  filter: { mode: FilterKey; label: string; year: number; month: number };
  summary: SummaryItem[];
  chart: ChartPoint[];
  counts: number[];
  bestProducts: BestProduct[];
  latestTransactions: Transaction[];
};

function formatIDR(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

function formatCompactID(n: number) {
  // sederhana: 312500000 -> "Rp 312,5 jt"
  if (n >= 1_000_000_000)
    return `Rp ${(n / 1_000_000_000).toFixed(1).replace(".", ",")} M`;
  if (n >= 1_000_000)
    return `Rp ${(n / 1_000_000).toFixed(1).replace(".", ",")} jt`;
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)} rb`;
  return `Rp ${n}`;
}

function formatDateID(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function LaporanPenjualan() {
  const [filterKey, setFilterKey] = useState<FilterKey>("month");
  const [filterLabel, setFilterLabel] = useState("Bulanan");
  const [counts, setCounts] = useState<number[]>([]);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<BestProduct[]>(
    []
  );
  const [latestTransactions, setLatestTransactions] = useState<Transaction[]>(
    []
  );
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isPrinting, setIsPrinting] = useState(false);

  const fetchReport = async (mode: FilterKey) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/report/sales?mode=${mode}&year=2024`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Gagal mengambil data laporan");
      const json = (await res.json()) as ApiResponse;

      setFilterLabel(json.filter.label);
      setCounts(json.counts);
      setChartData(json.chart);
      setBestSellingProducts(json.bestProducts);
      setLatestTransactions(json.latestTransactions);
      setSummary(json.summary);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(filterKey);
  }, [filterKey]);

  const handleExportPDF = () => {
    const prevTitle = document.title;

    const fileName =
      filterKey === "month"
        ? "laporan-penjualan-toko-bangunan-bulanan-2024"
        : "laporan-penjualan-toko-bangunan-tahunan-2024";

    document.title = fileName;
    setIsPrinting(true);

    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.title = prevTitle;
        setIsPrinting(false);
      }, 300);
    }, 200);
  };

  const yTicks = useMemo(() => {
    if (counts.length) return counts;
    const maxVal = Math.max(...chartData.map((c) => c.total), 0);
    const step = Math.ceil(maxVal / 5) || 1;
    return Array.from({ length: 6 }, (_, i) => i * step);
  }, [counts, chartData]);

  // mapping summary -> card
  const summaryCards = useMemo(() => {
    const get = (k: SummaryItem["key"]) => summary.find((s) => s.key === k);

    const revenue = get("revenue");
    const trx = get("transactions");
    const avg = get("avgOrder");
    const cust = get("newCustomers");

    return [
      {
        title: "Total Pendapatan",
        value: revenue ? formatCompactID(revenue.value) : "-",
        change: revenue
          ? `${revenue.changePct >= 0 ? "+" : ""}${revenue.changePct}%`
          : "-",
        changeLabel: "vs periode lalu",
        positive: (revenue?.changePct ?? 0) >= 0,
        icon: DollarSign,
      },
      {
        title: "Total Transaksi",
        value: trx ? trx.value.toLocaleString("id-ID") : "-",
        change: trx ? `${trx.changePct >= 0 ? "+" : ""}${trx.changePct}%` : "-",
        changeLabel: "vs periode lalu",
        positive: (trx?.changePct ?? 0) >= 0,
        icon: ShoppingCart,
      },
      {
        title: "Rata-rata Order",
        value: avg ? formatCompactID(avg.value) : "-",
        change: avg ? `${avg.changePct >= 0 ? "+" : ""}${avg.changePct}%` : "-",
        changeLabel: "vs periode lalu",
        positive: (avg?.changePct ?? 0) >= 0,
        icon: TrendingUp,
      },
      {
        title: "Pelanggan Baru",
        value: cust ? cust.value.toLocaleString("id-ID") : "-",
        change: cust
          ? `${cust.changePct >= 0 ? "+" : ""}${cust.changePct}%`
          : "-",
        changeLabel: "vs periode lalu",
        positive: (cust?.changePct ?? 0) >= 0,
        icon: Users,
      },
    ];
  }, [summary]);

  return (
    <>
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .print-avoid-break {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          #report-container {
            padding: 0 !important;
          }
        }
      `}</style>

      <div className="p-4 space-y-8" id="report-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print-avoid-break">
          <div>
            <h1 className="text-2xl font-bold">Laporan Penjualan</h1>
            <p className="text-gray-500 text-sm">
              Toko Bangunan — Pantau performa penjualan
            </p>
          </div>

          {/* Controls */}
          <div
            className={`flex items-center gap-3 ${
              isPrinting ? "no-print" : "no-print"
            }`}
          >
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                className={`px-3 py-1 rounded-md text-sm ${
                  filterKey === "month"
                    ? "bg-white text-blue-600 font-semibold"
                    : "text-gray-600"
                }`}
                onClick={() => setFilterKey("month")}
                type="button"
              >
                Bulanan
              </button>
              <button
                className={`px-3 py-1 rounded-md text-sm ${
                  filterKey === "year"
                    ? "bg-white text-blue-600 font-semibold"
                    : "text-gray-600"
                }`}
                onClick={() => setFilterKey("year")}
                type="button"
              >
                Tahunan
              </button>
            </div>

            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-md text-gray-600 text-sm">
              2024
            </div>

            <Button
              onClick={handleExportPDF}
              className="bg-blue-600 text-white hover:bg-blue-700"
              type="button"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-gray-500">Memuat data laporan...</div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print-avoid-break">
              {summaryCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Card key={card.title} className="rounded-lg shadow-sm p-4">
                    <CardContent className="flex items-center gap-4 p-0">
                      <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-500 text-sm">{card.title}</h3>
                        <p className="text-xl font-semibold">{card.value}</p>
                        <p
                          className={`text-xs ${
                            card.positive ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {card.change}{" "}
                          <span className="text-gray-500">
                            {card.changeLabel}
                          </span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Chart */}
            <Card className="p-4 rounded-lg shadow-sm print-avoid-break">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-semibold">
                  Total Penjualan {filterLabel} (juta)
                </h2>
                <div className="flex items-center gap-2 text-gray-600">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{filterLabel}</span>
                </div>
              </div>

              <CardContent className="p-0">
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <defs>
                        <linearGradient
                          id="chartGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3B82F6"
                            stopOpacity={0.25}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3B82F6"
                            stopOpacity={0.05}
                          />
                        </linearGradient>
                      </defs>

                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        ticks={yTicks}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        cursor={{
                          stroke: "#3B82F6",
                          strokeWidth: 1,
                          opacity: 0.2,
                        }}
                        contentStyle={{
                          borderRadius: 8,
                          borderColor: "#E5E7EB",
                          fontSize: 12,
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#0892D8"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#chartGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Produk Terlaris */}
            <Card className="p-4 rounded-lg shadow-sm print-avoid-break">
              <h2 className="text-base font-semibold mb-4">Produk Terlaris</h2>
              <CardContent className="p-0 space-y-4">
                {bestSellingProducts.map((p) => (
                  <div key={p.name} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">
                        {p.name}
                      </span>
                      <span className="font-semibold text-gray-800">
                        Rp {p.revenueJt} jt
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${p.percent}%`,
                          backgroundColor: "#3B82F6",
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      {p.percent}% dari total
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Transaksi Terbaru */}
            <Card className="p-4 rounded-lg shadow-sm print-avoid-break">
              <h2 className="text-base font-semibold mb-4">
                Transaksi Terbaru
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="text-left text-gray-600">
                    <tr className="bg-gray-50">
                      <th className="py-2 px-3">ID</th>
                      <th className="py-2 px-3">Pelanggan</th>
                      <th className="py-2 px-3">Produk</th>
                      <th className="py-2 px-3">Tanggal</th>
                      <th className="py-2 px-3">Jumlah</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestTransactions.map((trx, idx) => (
                      <tr
                        key={trx.id}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="py-2 px-3 font-medium text-gray-800">
                          {trx.id}
                        </td>
                        <td className="py-2 px-3 text-gray-800">
                          {trx.customer}
                        </td>
                        <td className="py-2 px-3 text-gray-800">
                          {trx.product}
                        </td>
                        <td className="py-2 px-3 text-gray-800">
                          {formatDateID(trx.dateISO)}
                        </td>
                        <td className="py-2 px-3 text-gray-800">
                          {formatIDR(trx.amount)}
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              trx.status === "Selesai"
                                ? "bg-green-50 text-green-600"
                                : trx.status === "Pending"
                                ? "bg-yellow-50 text-yellow-600"
                                : "bg-gray-50 text-gray-600"
                            }`}
                          >
                            {trx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </>
  );
}
