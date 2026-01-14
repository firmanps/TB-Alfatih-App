"use client";

import AktivitasPemimpin from "@/components/pemimpin/aktivitas";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/** ====== DUMMY DATA SECTION ====== */

// Simulasi user profile
const DUMMY_PROFILE = {
  username: "Supervisor Demo",
};

// Simulasi total produk baru (yang process)
const DUMMY_TOTAL_PRODUCT_PROCESS = {
  total: 7,
};

// Simulasi sales order list (biar logic "hari ini" tetap kepake)
const makeISO = (d: Date) => d.toISOString();
const todayISO = makeISO(new Date());
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const DUMMY_SALES_ORDERS = [
  { id: "SO-001", created_at: todayISO, customer: "Budi", total: 120000 },
  { id: "SO-002", created_at: todayISO, customer: "Sari", total: 350000 },
  {
    id: "SO-003",
    created_at: makeISO(yesterday),
    customer: "Andi",
    total: 90000,
  },
];

// Simulasi total review (kamu cuma butuh pagination.total_data)
const DUMMY_REVIEWS = {
  pagination: { total_data: 24 },
};

// Simulasi response grafik (formatnya meniru API kamu)
const DUMMY_GRAFIK = {
  filter: { key: "week", name: "Minggu ini" },
  interval: {
    data: [
      { day: "Sen", total: 3 },
      { day: "Sel", total: 5 },
      { day: "Rab", total: 2 },
      { day: "Kam", total: 6 },
      { day: "Jum", total: 4 },
      { day: "Sab", total: 7 },
      { day: "Ming", total: 1 },
    ],
    counts: [0, 2, 4, 6, 8, 10],
    high_value: 7,
    max_kelipatan: 10,
    kelipatan: 2,
  },
};

/** ====== COMPONENT ====== */
export default function DashboardPemimpin() {
  const router = useRouter();

  //state so hari ini
  const [orders, setOrders] = useState<any[]>([]);
  const [totalHariIni, setTotalHariIni] = useState(0);
  const [loading, setLoading] = useState(true);

  //state name user
  const [name, setName] = useState("");

  //state total rating
  const [totalRate, setTotalRate] = useState<number>(0);

  //state produk baru
  const [productsHariIni, setProductsHariIni] = useState<number>(0);

  // State untuk data grafik
  const [grafikData, setGrafikData] = useState<any[]>([]);
  const [filterName, setFilterName] = useState("Minggu ini");
  const [loadingGrafik, setLoadingGrafik] = useState(true);
  const [counts, setCounts] = useState<number[]>([]);

  /** ====== DUMMY FUNCTIONS (replace API calls) ====== */

  const nameUser = async () => {
    // pura-pura async biar struktur sama
    setName(DUMMY_PROFILE.username);
  };

  const produkBaru = async () => {
    setProductsHariIni(DUMMY_TOTAL_PRODUCT_PROCESS.total);
  };

  const soHariIni = async () => {
    try {
      const allOrders = DUMMY_SALES_ORDERS;

      // Tanggal hari ini dalam format YYYY-MM-DD
      const today = new Date().toISOString().split("T")[0];

      // Filter hanya data dengan created_at hari ini
      const todayOrders = allOrders.filter((order: any) => {
        const createdDate = order.created_at.split("T")[0];
        return createdDate === today;
      });

      setOrders(todayOrders);
      setTotalHariIni(todayOrders.length);
    } finally {
      setLoading(false);
    }
  };

  const totalRating = async () => {
    setTotalRate(DUMMY_REVIEWS.pagination.total_data);
  };

  // Fungsi untuk fetch data grafik
  const fetchGrafik = async () => {
    try {
      setLoadingGrafik(true);

      const formattedData = DUMMY_GRAFIK.interval.data.map((item) => ({
        name: item.day,
        total: item.total,
      }));

      setCounts(DUMMY_GRAFIK.interval.counts || []);
      setGrafikData(formattedData);
      setFilterName(DUMMY_GRAFIK.filter.name);
    } finally {
      setLoadingGrafik(false);
    }
  };

  useEffect(() => {
    nameUser();
    produkBaru();
    soHariIni();
    totalRating();
    fetchGrafik();
  }, []);

  return (
    <div className="mb-8 space-y-5">
      {/* grafik */}
      <Card className="p-4 rounded-xl bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold">Total Jumlah SO</h2>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-gray-600 border-gray-200 shadow-none hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            {filterName}
          </Button>
        </div>

        <CardContent className="p-0">
          <div className="h-[240px] w-full">
            {loadingGrafik ? (
              <div className="h-full flex items-center justify-center">
                <p>Loading grafik...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={grafikData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

                  <defs>
                    <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
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
                    tickLine={{ stroke: "#000", strokeWidth: 1 }}
                    tick={{ fill: "#111", fontSize: 12 }}
                  />
                  <YAxis
                    ticks={counts.length ? counts : undefined}
                    axisLine={false}
                    tickLine={{ stroke: "#000", strokeWidth: 1 }}
                    tick={{ fill: "#111", fontSize: 12 }}
                  />

                  <Tooltip
                    cursor={{ stroke: "#3B82F6", strokeWidth: 1, opacity: 0.2 }}
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
                    fill="url(#colorBlue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* aktivitas staff */}
      <div>
        <AktivitasPemimpin />
      </div>
    </div>
  );
}
