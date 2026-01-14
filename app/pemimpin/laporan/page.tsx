"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  DollarSign,
  Download,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

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

function getMonthName(month: number): string {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return months[month - 1] || "";
}

// Interface untuk props PrintableReport
interface PrintableReportProps {
  filterKey: FilterKey;
  selectedYear: number;
  selectedMonth: number;
  summary: SummaryItem[];
  chartData: ChartPoint[];
  bestSellingProducts: BestProduct[];
  latestTransactions: Transaction[];
  filterLabel: string;
}

// Komponen untuk konten cetak - akan dirender dalam iframe
const PrintableReport: React.FC<PrintableReportProps> = ({
  filterKey,
  selectedYear,
  selectedMonth,
  summary,
  bestSellingProducts,
  latestTransactions,
  filterLabel,
}) => {
  const revenue = summary.find((s) => s.key === "revenue")?.value || 0;
  const transactions =
    summary.find((s) => s.key === "transactions")?.value || 0;
  const avgOrder = summary.find((s) => s.key === "avgOrder")?.value || 0;
  const newCustomers =
    summary.find((s) => s.key === "newCustomers")?.value || 0;

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = currentDate.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Total item terjual (asumsi: dari jumlah transaksi)
  const totalItemsSold = latestTransactions.length * 10; // Contoh perkiraan

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        color: "#000",
      }}
    >
      {/* Header Laporan */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "5px",
            color: "#000",
          }}
        >
          LAPORAN PENJUALAN TOKO
        </h1>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "10px",
            color: "#000",
          }}
        >
          Toko Bangunan Alfatih
        </h2>
        <p style={{ fontSize: "14px", marginBottom: "5px", color: "#000" }}>
          Jl. Kubang Raya, Tarai Bangun, Kec. Tambang, Kabupaten Kampar, Riau
          28293
        </p>
        <p style={{ fontSize: "14px", marginBottom: "20px", color: "#000" }}>
          Telp: 082384939176
        </p>
      </div>

      {/* Informasi Laporan */}
      <div style={{ marginBottom: "30px" }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "10px",
            color: "#000",
          }}
        >
          Informasi Laporan
        </h3>
        <table
          style={{ width: "100%", borderCollapse: "collapse", color: "#000" }}
        >
          <tbody>
            <tr style={{ borderBottom: "1px solid #000" }}>
              <td
                style={{
                  padding: "8px",
                  fontWeight: "bold",
                  width: "30%",
                  color: "#000",
                }}
              >
                Jenis Laporan
              </td>
              <td style={{ padding: "8px", color: "#000" }}>
                {filterKey === "month"
                  ? "Penjualan Bulanan"
                  : "Penjualan Tahunan"}
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid #000" }}>
              <td style={{ padding: "8px", fontWeight: "bold", color: "#000" }}>
                Periode
              </td>
              <td style={{ padding: "8px", color: "#000" }}>
                {filterKey === "month"
                  ? `${getMonthName(selectedMonth)} ${selectedYear}`
                  : `Tahun ${selectedYear}`}
              </td>
            </tr>
            <tr style={{ borderBottom: "1px solid #000" }}>
              <td style={{ padding: "8px", fontWeight: "bold", color: "#000" }}>
                Tanggal
              </td>
              <td style={{ padding: "8px", color: "#000" }}>{formattedDate}</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #000" }}>
              <td style={{ padding: "8px", fontWeight: "bold", color: "#000" }}>
                Dicetak Oleh
              </td>
              <td style={{ padding: "8px", color: "#000" }}>Pemilik Tokoh</td>
            </tr>
            <tr>
              <td style={{ padding: "8px", fontWeight: "bold", color: "#000" }}>
                Waktu Cetak
              </td>
              <td style={{ padding: "8px", color: "#000" }}>{formattedTime}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Ringkasan Penjualan */}
      <div style={{ marginBottom: "30px" }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "15px",
            color: "#000",
          }}
        >
          Ringkasan Penjualan
        </h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #000",
            color: "#000",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th
                style={{
                  padding: "10px",
                  textAlign: "left",
                  border: "1px solid #000",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                Keterangan
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "left",
                  border: "1px solid #000",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                Nilai
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  color: "#000",
                }}
              >
                Total Transaksi
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  color: "#000",
                }}
              >
                {transactions.toLocaleString("id-ID")}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  color: "#000",
                }}
              >
                Total Item Terjual
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  color: "#000",
                }}
              >
                {totalItemsSold.toLocaleString("id-ID")}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  color: "#000",
                }}
              >
                Total Pendapatan
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  color: "#000",
                }}
              >
                {formatIDR(revenue)}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  color: "#000",
                }}
              >
                Rata-rata per Order
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  color: "#000",
                }}
              >
                {formatIDR(avgOrder)}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  color: "#000",
                }}
              >
                Pelanggan Baru
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  color: "#000",
                }}
              >
                {newCustomers.toLocaleString("id-ID")}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  color: "#000",
                }}
              >
                Metode Pembayaran
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  color: "#000",
                }}
              >
                Cash & Transfer
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Produk Terlaris */}
      <div style={{ marginBottom: "30px", pageBreakInside: "avoid" }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "15px",
            color: "#000",
          }}
        >
          Produk Terlaris
        </h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #000",
            color: "#000",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th
                style={{
                  padding: "10px",
                  textAlign: "left",
                  border: "1px solid #000",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                No
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "left",
                  border: "1px solid #000",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                Nama Produk
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "left",
                  border: "1px solid #000",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                Pendapatan
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "left",
                  border: "1px solid #000",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                Persentase
              </th>
            </tr>
          </thead>
          <tbody>
            {bestSellingProducts.map((product, index) => (
              <tr key={product.name}>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #000",
                    color: "#000",
                  }}
                >
                  {index + 1}
                </td>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #000",
                    color: "#000",
                  }}
                >
                  {product.name}
                </td>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #000",
                    color: "#000",
                  }}
                >
                  Rp {product.revenueJt} jt
                </td>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #000",
                    color: "#000",
                  }}
                >
                  {product.percent}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Transaksi */}
      <div style={{ marginBottom: "30px", pageBreakInside: "avoid" }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "15px",
            color: "#000",
          }}
        >
          Detail Penjualan
        </h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #000",
            color: "#000",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th
                style={{
                  padding: "8px",
                  textAlign: "left",
                  border: "1px solid #000",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                No
              </th>
              <th
                style={{
                  padding: "8px",
                  textAlign: "left",
                  border: "1px solid #000",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                Waktu
              </th>
              <th
                style={{
                  padding: "8px",
                  textAlign: "left",
                  border: "1px solid #000",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                No Transaksi
              </th>
              <th
                style={{
                  padding: "8px",
                  textAlign: "left",
                  border: "1px solid #000",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                Nama Produk
              </th>
              <th
                style={{
                  padding: "8px",
                  textAlign: "left",
                  border: "1px solid #000",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                Qty
              </th>
              <th
                style={{
                  padding: "8px",
                  textAlign: "left",
                  border: "1px solid #000",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                Harga
              </th>
              <th
                style={{
                  padding: "8px",
                  textAlign: "left",
                  border: "1px solid #000",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                Subtotal
              </th>
              <th
                style={{
                  padding: "8px",
                  textAlign: "left",
                  border: "1px solid #000",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {latestTransactions.map((trx, index) => {
              const date = new Date(trx.dateISO);
              const time = date.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              });
              // Asumsi quantity (untuk contoh, kita buat random 1-10)
              const quantity = Math.floor(Math.random() * 10) + 1;
              const price = Math.floor(trx.amount / quantity);

              return (
                <tr key={trx.id}>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    {index + 1}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    {time}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    {trx.id}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    {trx.product}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    {quantity}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    {formatIDR(price)}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    {formatIDR(trx.amount)}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    {trx.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Rekapitulasi */}
      <div style={{ marginBottom: "30px", pageBreakInside: "avoid" }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "15px",
            color: "#000",
          }}
        >
          Rekapitulasi
        </h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #000",
            color: "#000",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th
                style={{
                  padding: "10px",
                  textAlign: "left",
                  border: "1px solid #000",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                Keterangan
              </th>
              <th
                style={{
                  padding: "10px",
                  textAlign: "left",
                  border: "1px solid #000",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                Jumlah
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  color: "#000",
                }}
              >
                Total Penjualan
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  color: "#000",
                }}
              >
                {formatIDR(revenue)}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  color: "#000",
                }}
              >
                Diskon
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  color: "#000",
                }}
              >
                Rp 0
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  color: "#000",
                }}
              >
                Pajak
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  color: "#000",
                }}
              >
                Rp 0
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                Total Bersih
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                {formatIDR(revenue)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tanda Tangan */}
      <div
        style={{
          marginTop: "60px",
          textAlign: "center",
          pageBreakInside: "avoid",
        }}
      >
        <div style={{ marginBottom: "80px" }}>
          <p
            style={{
              color: "#000",
              fontWeight: "bold",
              fontSize: "16px",
              marginBottom: "30px",
            }}
          >
            Pemilik Toko
          </p>

          {/* Gambar tanda tangan */}
          <div
            style={{
              margin: "20px auto 10px",
              width: "200px",
              height: "100px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Ganti /signature.png dengan path gambar tanda tangan Anda */}
            <img
              src="/assets/ttd.png"
              alt="Tanda Tangan Pemilik Toko"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Nama Pemilik Toko */}
          <div
            style={{
              marginTop: "15px",
              paddingTop: "15px",
              borderTop: "1px solid #000",
              width: "250px",
              margin: "15px auto 0",
            }}
          >
            <p
              style={{
                color: "#000",
                fontWeight: "bold",
                fontSize: "14px",
                marginBottom: "5px",
              }}
            >
              Dedi Wijaya Alfatih
            </p>
            <p
              style={{
                color: "#000",
                fontSize: "12px",
              }}
            >
              Pemilik Toko Bangunan Alafatih
            </p>
          </div>
        </div>

        <div
          style={{
            fontSize: "12px",
            color: "#000",
            marginTop: "40px",
            paddingTop: "20px",
            borderTop: "1px solid #ddd",
          }}
        >
          <p>
            <strong>Laporan ini sah dan berlaku tanpa stempel basah</strong>
          </p>
          <p>
            Dokumen ini dicetak dari Sistem Manajemen Toko Bangunan Alafatih
          </p>
          <p style={{ marginTop: "10px", fontSize: "11px" }}>
            Berlaku sampai dengan:{" "}
            {new Date(
              new Date().setMonth(new Date().getMonth() + 1)
            ).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function LaporanPenjualan() {
  const [filterKey, setFilterKey] = useState<FilterKey>("month");
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [filterLabel, setFilterLabel] = useState("Bulanan");
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [bestSellingProducts, setBestSellingProducts] = useState<BestProduct[]>(
    []
  );
  const [latestTransactions, setLatestTransactions] = useState<Transaction[]>(
    []
  );
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate tahun untuk dropdown (5 tahun terakhir)
  const years = Array.from({ length: 5 }, (_, i) => {
    const currentYear = new Date().getFullYear();
    return currentYear - i;
  });

  const months = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" },
  ];

  const fetchReport = async (mode: FilterKey, year: number, month?: number) => {
    try {
      setLoading(true);
      let url = `/api/report/sales?mode=${mode}&year=${year}`;
      if (mode === "month" && month) {
        url += `&month=${month}`;
      }

      const res = await fetch(url, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Gagal mengambil data laporan");
      const json = (await res.json()) as ApiResponse;

      setFilterLabel(json.filter.label);
      setChartData(json.chart);
      setBestSellingProducts(json.bestProducts);
      setLatestTransactions(json.latestTransactions);
      setSummary(json.summary);
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filterKey === "month") {
      fetchReport(filterKey, selectedYear, selectedMonth);
    } else {
      fetchReport(filterKey, selectedYear);
    }
  }, [filterKey, selectedYear, selectedMonth]);

  const handleExportPDF = () => {
    // Buat konten untuk cetak
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Buat struktur HTML untuk print
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Penjualan - ${
          filterKey === "month"
            ? getMonthName(selectedMonth) + " " + selectedYear
            : "Tahun " + selectedYear
        }</title>
        <style>
          @media print {
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              font-family: Arial, sans-serif;
              color: #000;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              page-break-inside: avoid;
            }
            th, td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f0f0f0;
              font-weight: bold;
            }
            .page-break {
              page-break-before: always;
            }
          }
        </style>
      </head>
      <body>
    `);

    // Buat elemen sementara untuk merender komponen
    const tempDiv = document.createElement("div");
    document.body.appendChild(tempDiv);

    // Import React dan ReactDOM client untuk merender
    import("react-dom/client").then(({ createRoot }) => {
      const root = createRoot(tempDiv);
      root.render(
        React.createElement(PrintableReport, {
          filterKey,
          selectedYear,
          selectedMonth,
          summary,
          chartData,
          bestSellingProducts: bestSellingProducts,
          latestTransactions: latestTransactions,
          filterLabel,
        })
      );

      // Tunggu sebentar untuk merender, lalu ambil HTML
      setTimeout(() => {
        const content = tempDiv.innerHTML;

        printWindow.document.write(`
          ${content}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            }
          </script>
        `);
        printWindow.document.write("</body></html>");
        printWindow.document.close();

        // Hapus elemen sementara
        document.body.removeChild(tempDiv);
      }, 100);
    });
  };

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
      {/* Tampilan utama */}
      <div className="p-4 space-y-8">
        {/* Header utama */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Laporan Penjualan</h1>
            <p className="text-gray-500 text-sm">
              Toko Bangunan — Pantau performa penjualan
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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

            {/* Pilih Tahun */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <Select
                value={selectedYear.toString()}
                onValueChange={(value) => setSelectedYear(parseInt(value))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Pilih Tahun" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Pilih Bulan (hanya tampil saat mode bulanan) */}
            {filterKey === "month" && (
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Pilih Bulan" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem
                      key={month.value}
                      value={month.value.toString()}
                    >
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button
              onClick={handleExportPDF}
              className="bg-blue-600 text-white hover:bg-blue-700"
              type="button"
            >
              <Download className="w-4 h-4 mr-2" />
              Cetak PDF
            </Button>
          </div>
        </div>

        {/* Info Periode */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Periode Laporan:</h3>
          <p className="text-blue-700">
            {filterKey === "month"
              ? `Laporan Bulanan - ${getMonthName(
                  selectedMonth
                )} ${selectedYear}`
              : `Laporan Tahunan - ${selectedYear}`}
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-gray-500">Memuat data laporan...</div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* Produk Terlaris */}
            <Card className="p-4 rounded-lg shadow-sm">
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
            <Card className="p-4 rounded-lg shadow-sm">
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
