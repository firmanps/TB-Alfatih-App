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
  CheckCircle,
  DollarSign,
  Download,
  Package,
  ShoppingBag,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

type FilterKey = "month" | "year";

type StaffActivity = {
  id: string;
  name: string;
  position: string;
  totalSales: number;
  totalTransactions: number;
  totalRevenue: number;
  achievementRate: number;
  products: {
    name: string;
    quantity: number;
    totalAmount: number;
  }[];
  transactions: {
    id: string;
    date: string;
    product: string;
    quantity: number;
    unitPrice: number;
    totalAmount: number;
    type: "Penjualan" | "Penawaran" | "Konsultasi";
  }[];
};

type ApiResponse = {
  ok: boolean;
  filter: { mode: FilterKey; label: string; year: number; month: number };
  staffActivities: StaffActivity[];
  summary: {
    totalStaff: number;
    totalRevenue: number;
    totalTransactions: number;
    avgAchievement: number;
  };
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

function formatDateID(date: string) {
  const d = new Date(date);
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
interface PrintableStaffActivityReportProps {
  filterKey: FilterKey;
  selectedYear: number;
  selectedMonth: number;
  staffActivities: StaffActivity[];
  summary: {
    totalStaff: number;
    totalRevenue: number;
    totalTransactions: number;
    avgAchievement: number;
  };
}

// Komponen untuk konten cetak laporan aktivitas staf
const PrintableStaffActivityReport: React.FC<
  PrintableStaffActivityReportProps
> = ({ filterKey, selectedYear, selectedMonth, staffActivities, summary }) => {
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
          LAPORAN AKTIVITAS STAF
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
                  ? "Aktivitas Staf Bulanan"
                  : "Aktivitas Staf Tahunan"}
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
              <td style={{ padding: "8px", color: "#000" }}>Pemilik</td>
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

      {/* Ringkasan Performa */}
      <div style={{ marginBottom: "30px" }}>
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "15px",
            color: "#000",
          }}
        >
          Ringkasan Performa Staf
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
                Total Staf
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  color: "#000",
                }}
              >
                {summary.totalStaff} orang
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
                Total Transaksi
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  color: "#000",
                }}
              >
                {summary.totalTransactions.toLocaleString("id-ID")}
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
                {formatIDR(summary.totalRevenue)}
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
                Rata-rata Pencapaian
              </td>
              <td
                style={{
                  padding: "10px",
                  border: "1px solid #000",
                  color: "#000",
                }}
              >
                {summary.avgAchievement}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Detail Aktivitas Per Staf */}
      {staffActivities.map((staff, index) => (
        <div
          key={staff.id}
          style={{ marginBottom: "40px", pageBreakInside: "avoid" }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "15px",
              color: "#000",
              backgroundColor: "#f8f9fa",
              padding: "10px",
              borderLeft: "4px solid #3B82F6",
            }}
          >
            {index + 1}. {staff.name} - {staff.position}
          </h3>

          {/* Ringkasan Staf */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #000",
              marginBottom: "15px",
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
                  Metrik
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
                  Nilai
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
                  Pencapaian
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #000",
                    color: "#000",
                  }}
                >
                  Total Penjualan
                </td>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #000",
                    color: "#000",
                  }}
                >
                  {staff.totalSales.toLocaleString("id-ID")}
                </td>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #000",
                    color: "#000",
                  }}
                >
                  {staff.achievementRate}%
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #000",
                    color: "#000",
                  }}
                >
                  Total Transaksi
                </td>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #000",
                    color: "#000",
                  }}
                >
                  {staff.totalTransactions.toLocaleString("id-ID")}
                </td>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #000",
                    color: "#000",
                  }}
                >
                  {Math.round(
                    (staff.totalTransactions / summary.totalTransactions) * 100
                  )}
                  % dari total
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #000",
                    color: "#000",
                  }}
                >
                  Total Pendapatan
                </td>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #000",
                    color: "#000",
                  }}
                >
                  {formatIDR(staff.totalRevenue)}
                </td>
                <td
                  style={{
                    padding: "8px",
                    border: "1px solid #000",
                    color: "#000",
                  }}
                >
                  {Math.round(
                    (staff.totalRevenue / summary.totalRevenue) * 100
                  )}
                  % dari total
                </td>
              </tr>
            </tbody>
          </table>

          {/* Produk Terjual */}
          <h4
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "10px",
              color: "#000",
            }}
          >
            Produk yang Berhasil Dijual:
          </h4>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #000",
              marginBottom: "15px",
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
                  Kuantitas
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
                  Total Nilai
                </th>
              </tr>
            </thead>
            <tbody>
              {staff.products.map((product, idx) => (
                <tr key={idx}>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    {idx + 1}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    {product.name}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    {product.quantity}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    {formatIDR(product.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Detail Transaksi */}
          <h4
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              marginBottom: "10px",
              color: "#000",
            }}
          >
            Detail Transaksi:
          </h4>
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
                  Tanggal
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
                  ID Transaksi
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
                  Produk
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
                  Harga/Unit
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
                  Total
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
                  Jenis
                </th>
              </tr>
            </thead>
            <tbody>
              {staff.transactions.map((transaction, idx) => (
                <tr key={transaction.id}>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    {idx + 1}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    {formatDateID(transaction.date)}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    {transaction.id}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    {transaction.product}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    {transaction.quantity}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    {formatIDR(transaction.unitPrice)}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    {formatIDR(transaction.totalAmount)}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      border: "1px solid #000",
                      color: "#000",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor:
                          transaction.type === "Penjualan"
                            ? "#dcfce7"
                            : transaction.type === "Penawaran"
                            ? "#fef3c7"
                            : "#dbeafe",
                        color:
                          transaction.type === "Penjualan"
                            ? "#166534"
                            : transaction.type === "Penawaran"
                            ? "#92400e"
                            : "#1e40af",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                    >
                      {transaction.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

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

export default function LaporanAktivitasStaf() {
  const [filterKey, setFilterKey] = useState<FilterKey>("month");
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [staffActivities, setStaffActivities] = useState<StaffActivity[]>([]);
  const [summary, setSummary] = useState({
    totalStaff: 0,
    totalRevenue: 0,
    totalTransactions: 0,
    avgAchievement: 0,
  });
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

  // Data dummy untuk aktivitas staf
  const dummyStaffActivities: StaffActivity[] = [
    {
      id: "STF001",
      name: "Ahmad Fauzi",
      position: "Sales Executive",
      totalSales: 42,
      totalTransactions: 56,
      totalRevenue: 125_500_000,
      achievementRate: 85,
      products: [
        { name: "Semen 50kg", quantity: 120, totalAmount: 9_600_000 },
        { name: "Besi Beton 10mm", quantity: 85, totalAmount: 6_800_000 },
        { name: "Cat Tembok 5L", quantity: 45, totalAmount: 5_175_000 },
        { name: "Keramik 40×40", quantity: 60, totalAmount: 7_500_000 },
      ],
      transactions: [
        {
          id: "TRX001",
          date: "2024-01-14",
          product: "Semen 50kg",
          quantity: 20,
          unitPrice: 80_000,
          totalAmount: 1_600_000,
          type: "Penjualan",
        },
        {
          id: "TRX005",
          date: "2024-01-13",
          product: "Besi Beton 10mm",
          quantity: 15,
          unitPrice: 75_000,
          totalAmount: 1_125_000,
          type: "Penjualan",
        },
        {
          id: "TRX008",
          date: "2024-01-12",
          product: "Cat Tembok 5L",
          quantity: 8,
          unitPrice: 115_000,
          totalAmount: 920_000,
          type: "Penawaran",
        },
        {
          id: "TRX012",
          date: "2024-01-11",
          product: "Keramik 40×40",
          quantity: 25,
          unitPrice: 125_000,
          totalAmount: 3_125_000,
          type: "Penjualan",
        },
      ],
    },
    {
      id: "STF002",
      name: "Siti Rahayu",
      position: "Sales Supervisor",
      totalSales: 38,
      totalTransactions: 48,
      totalRevenue: 98_750_000,
      achievementRate: 92,
      products: [
        { name: "Cat Tembok 5L", quantity: 75, totalAmount: 8_625_000 },
        { name: "Paku & Baut (paket)", quantity: 150, totalAmount: 2_625_000 },
        { name: "Semen 50kg", quantity: 80, totalAmount: 6_400_000 },
        { name: "Lem Keramik", quantity: 95, totalAmount: 4_750_000 },
      ],
      transactions: [
        {
          id: "TRX002",
          date: "2024-01-14",
          product: "Cat Tembok 5L",
          quantity: 10,
          unitPrice: 115_000,
          totalAmount: 1_150_000,
          type: "Penjualan",
        },
        {
          id: "TRX006",
          date: "2024-01-13",
          product: "Paku & Baut (paket)",
          quantity: 25,
          unitPrice: 17_500,
          totalAmount: 437_500,
          type: "Penjualan",
        },
        {
          id: "TRX009",
          date: "2024-01-12",
          product: "Semen 50kg",
          quantity: 15,
          unitPrice: 80_000,
          totalAmount: 1_200_000,
          type: "Penawaran",
        },
        {
          id: "TRX013",
          date: "2024-01-11",
          product: "Lem Keramik",
          quantity: 30,
          unitPrice: 50_000,
          totalAmount: 1_500_000,
          type: "Penjualan",
        },
      ],
    },
    {
      id: "STF003",
      name: "Budi Santoso",
      position: "Senior Sales",
      totalSales: 51,
      totalTransactions: 62,
      totalRevenue: 156_250_000,
      achievementRate: 105,
      products: [
        { name: "Besi Beton 10mm", quantity: 120, totalAmount: 10_800_000 },
        { name: "Semen 50kg", quantity: 150, totalAmount: 12_000_000 },
        { name: "Keramik 40×40", quantity: 85, totalAmount: 10_625_000 },
        { name: 'Pipa PVC 3"', quantity: 65, totalAmount: 5_200_000 },
      ],
      transactions: [
        {
          id: "TRX003",
          date: "2024-01-14",
          product: "Besi Beton 10mm",
          quantity: 25,
          unitPrice: 75_000,
          totalAmount: 1_875_000,
          type: "Penjualan",
        },
        {
          id: "TRX007",
          date: "2024-01-13",
          product: "Semen 50kg",
          quantity: 30,
          unitPrice: 80_000,
          totalAmount: 2_400_000,
          type: "Penjualan",
        },
        {
          id: "TRX010",
          date: "2024-01-12",
          product: "Keramik 40×40",
          quantity: 20,
          unitPrice: 125_000,
          totalAmount: 2_500_000,
          type: "Penawaran",
        },
        {
          id: "TRX014",
          date: "2024-01-11",
          product: 'Pipa PVC 3"',
          quantity: 15,
          unitPrice: 80_000,
          totalAmount: 1_200_000,
          type: "Penjualan",
        },
      ],
    },
    {
      id: "STF004",
      name: "Dewi Lestari",
      position: "Sales Associate",
      totalSales: 29,
      totalTransactions: 35,
      totalRevenue: 67_850_000,
      achievementRate: 78,
      products: [
        { name: "Cat Kayu", quantity: 45, totalAmount: 6_750_000 },
        { name: "Lem Kayu", quantity: 85, totalAmount: 3_825_000 },
        { name: "Amplas", quantity: 120, totalAmount: 1_200_000 },
        { name: "Kuas Cat", quantity: 95, totalAmount: 1_425_000 },
      ],
      transactions: [
        {
          id: "TRX004",
          date: "2024-01-14",
          product: "Cat Kayu",
          quantity: 8,
          unitPrice: 150_000,
          totalAmount: 1_200_000,
          type: "Penjualan",
        },
        {
          id: "TRX011",
          date: "2024-01-13",
          product: "Lem Kayu",
          quantity: 15,
          unitPrice: 45_000,
          totalAmount: 675_000,
          type: "Penjualan",
        },
        {
          id: "TRX015",
          date: "2024-01-12",
          product: "Amplas",
          quantity: 25,
          unitPrice: 10_000,
          totalAmount: 250_000,
          type: "Penawaran",
        },
        {
          id: "TRX016",
          date: "2024-01-11",
          product: "Kuas Cat",
          quantity: 20,
          unitPrice: 15_000,
          totalAmount: 300_000,
          type: "Penjualan",
        },
      ],
    },
  ];

  const fetchStaffActivities = async (
    mode: FilterKey,
    year: number,
    month?: number
  ) => {
    try {
      setLoading(true);
      // Simulasi API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Gunakan data dummy
      const totalRevenue = dummyStaffActivities.reduce(
        (sum, staff) => sum + staff.totalRevenue,
        0
      );
      const totalTransactions = dummyStaffActivities.reduce(
        (sum, staff) => sum + staff.totalTransactions,
        0
      );
      const avgAchievement = Math.round(
        dummyStaffActivities.reduce(
          (sum, staff) => sum + staff.achievementRate,
          0
        ) / dummyStaffActivities.length
      );

      setStaffActivities(dummyStaffActivities);
      setSummary({
        totalStaff: dummyStaffActivities.length,
        totalRevenue,
        totalTransactions,
        avgAchievement,
      });
    } catch (error) {
      console.error("Error fetching staff activities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filterKey === "month") {
      fetchStaffActivities(filterKey, selectedYear, selectedMonth);
    } else {
      fetchStaffActivities(filterKey, selectedYear);
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
        <title>Laporan Aktivitas Staf - ${
          filterKey === "month"
            ? getMonthName(selectedMonth) + " " + selectedYear
            : "Tahun " + selectedYear
        }</title>
        <style>
          @media print {
            @page {
              size: A4 landscape;
              margin: 15mm;
            }
            body {
              font-family: Arial, sans-serif;
              color: #000;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              page-break-inside: avoid;
              font-size: 11px;
            }
            th, td {
              border: 1px solid #000;
              padding: 6px;
              text-align: left;
            }
            th {
              background-color: #f0f0f0;
              font-weight: bold;
            }
            .page-break {
              page-break-before: always;
            }
            h3, h4 {
              page-break-after: avoid;
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
        React.createElement(PrintableStaffActivityReport, {
          filterKey,
          selectedYear,
          selectedMonth,
          staffActivities,
          summary,
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

  // Ringkasan statistik untuk tampilan utama
  const summaryCards = useMemo(
    () => [
      {
        title: "Total Staf",
        value: summary.totalStaff.toString(),
        description: "Jumlah staf aktif",
        icon: Users,
        color: "bg-blue-50 text-blue-600",
      },
      {
        title: "Total Pendapatan",
        value: formatCompactID(summary.totalRevenue),
        description: "Dari seluruh staf",
        icon: DollarSign,
        color: "bg-green-50 text-green-600",
      },
      {
        title: "Total Transaksi",
        value: summary.totalTransactions.toLocaleString("id-ID"),
        description: "Penjualan & Penawaran",
        icon: ShoppingBag,
        color: "bg-purple-50 text-purple-600",
      },
      {
        title: "Rata-rata Pencapaian",
        value: `${summary.avgAchievement}%`,
        description: "Target tercapai",
        icon: TrendingUp,
        color: "bg-orange-50 text-orange-600",
      },
    ],
    [summary]
  );

  return (
    <>
      {/* Tampilan utama */}
      <div className="p-4 space-y-8">
        {/* Header utama */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Laporan Aktivitas Staf</h1>
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
          <div className="text-gray-500">Memuat data aktivitas staf...</div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {summaryCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Card key={card.title} className="rounded-lg shadow-sm p-4">
                    <CardContent className="flex items-center gap-4 p-0">
                      <div className={`p-3 rounded-lg ${card.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-500 text-sm">{card.title}</h3>
                        <p className="text-xl font-semibold">{card.value}</p>
                        <p className="text-xs text-gray-500">
                          {card.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Detail Aktivitas Per Staf */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Detail Performa Staf</h2>
              {staffActivities.map((staff) => (
                <Card key={staff.id} className="rounded-lg shadow-sm">
                  <div className="p-4">
                    {/* Header Staf */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{staff.name}</h3>
                          <p className="text-gray-600 text-sm">
                            {staff.position}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {staff.achievementRate}%
                          </div>
                          <div className="text-xs text-gray-500">
                            Pencapaian
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {staff.totalTransactions}
                          </div>
                          <div className="text-xs text-gray-500">Transaksi</div>
                        </div>
                      </div>
                    </div>

                    {/* Ringkasan Staf */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500">
                          Total Penjualan
                        </div>
                        <div className="text-lg font-semibold">
                          {staff.totalSales}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500">
                          Total Pendapatan
                        </div>
                        <div className="text-lg font-semibold">
                          {formatCompactID(staff.totalRevenue)}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500">
                          Produk Terjual
                        </div>
                        <div className="text-lg font-semibold">
                          {staff.products.length}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-500">Transaksi</div>
                        <div className="text-lg font-semibold">
                          {staff.totalTransactions}
                        </div>
                      </div>
                    </div>

                    {/* Produk Terjual */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Produk yang Berhasil Dijual
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {staff.products.map((product, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-gray-500">
                                Qty: {product.quantity}
                              </div>
                            </div>
                            <div className="font-semibold">
                              {formatIDR(product.totalAmount)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Transaksi Terbaru */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Transaksi Terbaru
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="text-left text-gray-600 bg-gray-50">
                            <tr>
                              <th className="py-2 px-3">ID</th>
                              <th className="py-2 px-3">Tanggal</th>
                              <th className="py-2 px-3">Produk</th>
                              <th className="py-2 px-3">Qty</th>
                              <th className="py-2 px-3">Harga</th>
                              <th className="py-2 px-3">Total</th>
                              <th className="py-2 px-3">Jenis</th>
                            </tr>
                          </thead>
                          <tbody>
                            {staff.transactions.map((transaction) => (
                              <tr key={transaction.id} className="border-t">
                                <td className="py-2 px-3 font-medium">
                                  {transaction.id}
                                </td>
                                <td className="py-2 px-3">
                                  {formatDateID(transaction.date)}
                                </td>
                                <td className="py-2 px-3">
                                  {transaction.product}
                                </td>
                                <td className="py-2 px-3">
                                  {transaction.quantity}
                                </td>
                                <td className="py-2 px-3">
                                  {formatIDR(transaction.unitPrice)}
                                </td>
                                <td className="py-2 px-3 font-semibold">
                                  {formatIDR(transaction.totalAmount)}
                                </td>
                                <td className="py-2 px-3">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      transaction.type === "Penjualan"
                                        ? "bg-green-50 text-green-600"
                                        : transaction.type === "Penawaran"
                                        ? "bg-yellow-50 text-yellow-600"
                                        : "bg-blue-50 text-blue-600"
                                    }`}
                                  >
                                    {transaction.type}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
