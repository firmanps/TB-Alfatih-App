"use client";

import AktivitasPemimpin from "@/components/pemimpin/aktivitas";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Filter } from "lucide-react";
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

/** ====== TYPES ====== */
type FilterKey = "month" | "year";
type ChartPoint = { name: string; total: number };

/** ====== DUMMY GRAFIK ====== */
const DUMMY_GRAFIK_BY_FILTER: Record<
  FilterKey,
  {
    filterName: string;
    data: ChartPoint[];
    counts: number[];
  }
> = {
  month: {
    filterName: "Bulan ini",
    data: [
      { name: "Minggu 1", total: 12 },
      { name: "Minggu 2", total: 18 },
      { name: "Minggu 3", total: 9 },
      { name: "Minggu 4", total: 22 },
    ],
    counts: [0, 5, 10, 15, 20, 25],
  },
  year: {
    filterName: "Tahun ini",
    data: [
      { name: "Jan", total: 45 },
      { name: "Feb", total: 38 },
      { name: "Mar", total: 52 },
      { name: "Apr", total: 41 },
      { name: "Mei", total: 60 },
      { name: "Jun", total: 55 },
      { name: "Jul", total: 63 },
      { name: "Agu", total: 48 },
      { name: "Sep", total: 57 },
      { name: "Okt", total: 70 },
      { name: "Nov", total: 62 },
      { name: "Des", total: 75 },
    ],
    counts: [0, 20, 40, 60, 80, 100],
  },
};

export default function DashboardPemimpin() {
  /** ====== STATE ====== */
  const [filterKey, setFilterKey] = useState<FilterKey>("month");
  const [filterName, setFilterName] = useState("Bulan ini");
  const [grafikData, setGrafikData] = useState<ChartPoint[]>([]);
  const [counts, setCounts] = useState<number[]>([]);
  const [loadingGrafik, setLoadingGrafik] = useState(true);

  /** ====== FETCH GRAFIK (DUMMY) ====== */
  const fetchGrafik = async (key: FilterKey) => {
    setLoadingGrafik(true);
    await new Promise((r) => setTimeout(r, 200)); // simulasi loading

    const res = DUMMY_GRAFIK_BY_FILTER[key];
    setGrafikData(res.data);
    setCounts(res.counts);
    setFilterName(res.filterName);

    setLoadingGrafik(false);
  };

  useEffect(() => {
    fetchGrafik(filterKey);
  }, [filterKey]);

  /** ====== Y AXIS FALLBACK ====== */
  const yTicks = useMemo(() => {
    if (counts.length) return counts;
    const max = Math.max(...grafikData.map((d) => d.total), 0);
    const step = Math.ceil(max / 5) || 1;
    return Array.from({ length: 6 }, (_, i) => i * step);
  }, [counts, grafikData]);

  return (
    <div className="mb-8 space-y-5">
      <Card className="p-4 rounded-xl bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold">Total Jumlah SO</h2>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-gray-600 border-gray-200 shadow-none"
            >
              <Filter className="h-4 w-4" />
              {filterName}
            </Button>

            <select
              value={filterKey}
              onChange={(e) => setFilterKey(e.target.value as FilterKey)}
              className="border border-gray-200 rounded-md px-2 py-1 text-sm"
            >
              <option value="month">Bulanan</option>
              <option value="year">Tahunan</option>
            </select>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="h-[240px] w-full">
            {loadingGrafik ? (
              <div className="h-full flex items-center justify-center">
                <p>Loading grafik...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={grafikData}>
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

                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis ticks={yTicks} tick={{ fontSize: 12 }} />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#0892D8"
                    strokeWidth={3}
                    fill="url(#colorBlue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      <AktivitasPemimpin />
    </div>
  );
}
