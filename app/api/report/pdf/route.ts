import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

(pdfMake as any).vfs = (pdfFonts as any).pdfMake.vfs;

type Row = {
  no: number;
  nama: string;
  satuan: string;
  hargaSatuan: number;
  vol: number;
  tanggal: string; // "1/6/2022"
};

function rupiah(n: number) {
  return n.toLocaleString("id-ID");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = (searchParams.get("mode") ?? "month") as "month" | "year";
  const period = searchParams.get("period") ?? "JUNI 2022";

  // ✅ nama file (sebelumnya kamu belum define, jadi pasti error)
  const filename =
    mode === "month"
      ? `laporan-penjualan-bulanan-${period}.pdf`
      : `laporan-penjualan-tahunan-${period}.pdf`;

  // DUMMY TOKO BANGUNAN
  const rows: Row[] = [
    {
      no: 1,
      nama: 'Besi 10" sedang',
      satuan: "btg",
      hargaSatuan: 70000,
      vol: 5,
      tanggal: "1/6/2022",
    },
    {
      no: 2,
      nama: "Kawat beton",
      satuan: "kg",
      hargaSatuan: 30000,
      vol: 1,
      tanggal: "1/6/2022",
    },
    {
      no: 3,
      nama: "Bata Merah",
      satuan: "biji",
      hargaSatuan: 750,
      vol: 400,
      tanggal: "1/6/2022",
    },
    {
      no: 4,
      nama: "Semen Padang",
      satuan: "zak",
      hargaSatuan: 55000,
      vol: 20,
      tanggal: "1/6/2022",
    },
  ];

  const bodyTable: any[] = [
    [
      { text: "NO", bold: true },
      { text: "NAMA MATERIAL", bold: true },
      { text: "SATUAN", bold: true },
      { text: "HARGA SATUAN", bold: true, alignment: "right" },
      { text: "Vol", bold: true, alignment: "right" },
      { text: "JUMLAH HARGA", bold: true, alignment: "right" },
      { text: "TGL/BL/TH", bold: true, alignment: "right" },
    ],
    ...rows.map((r) => {
      const jumlah = r.hargaSatuan * r.vol;
      return [
        r.no,
        r.nama,
        r.satuan,
        { text: rupiah(r.hargaSatuan), alignment: "right" },
        { text: r.vol, alignment: "right" },
        { text: rupiah(jumlah), alignment: "right" },
        { text: r.tanggal, alignment: "right" },
      ];
    }),
  ];

  const total = rows.reduce((acc, r) => acc + r.hargaSatuan * r.vol, 0);

  const docDefinition: any = {
    pageSize: "A4",
    pageMargins: [30, 30, 30, 30],
    content: [
      { text: "LAPORAN PENJUALAN", style: "title" },
      {
        text: mode === "month" ? `BULAN ${period}` : `TAHUN ${period}`,
        style: "subtitle",
        margin: [0, 0, 0, 14],
      },

      {
        table: {
          headerRows: 1,
          widths: [28, "*", 55, 85, 40, 95, 70],
          body: bodyTable,
        },
        layout: {
          fillColor: (rowIndex: number) => (rowIndex === 0 ? "#F3F4F6" : null),
          hLineWidth: () => 1,
          vLineWidth: () => 1,
        },
      },

      {
        text: `TOTAL: Rp ${rupiah(total)}`,
        alignment: "right",
        bold: true,
        margin: [0, 10, 0, 0],
      },

      { text: "", margin: [0, 30, 0, 0] },

      // area tanda tangan
      {
        columns: [
          { width: "*", text: "" },
          {
            width: 220,
            stack: [
              { text: "Pemilik Toko", alignment: "center" },
              { text: "\n\n\n\n", alignment: "center" },
              { text: "(____________________)", alignment: "center" },
            ],
          },
        ],
      },
    ],
    styles: {
      title: { fontSize: 14, bold: true, alignment: "center" },
      subtitle: { fontSize: 12, bold: true, alignment: "center" },
    },
    defaultStyle: { fontSize: 10 },
  };

  // ✅ generate pdf buffer
  const pdfDoc = (pdfMake as any).createPdf(docDefinition);

  [
    {
      resource:
        "/c:/Users/bukan/OneDrive/Documents/KULIAH/FIAN SEMESTER 7/KP/app-katalog-tb-alfatih/app/api/report/pdf/route.ts",
      owner: "typescript",
      code: "2345",
      severity: 8,
      message:
        "Argument of type 'ArrayBufferLike' is not assignable to parameter of type 'BodyInit | null | undefined'.\n  Type 'SharedArrayBuffer' is not assignable to type 'BodyInit | null | undefined'.\n    Type 'SharedArrayBuffer' is missing the following properties from type 'ArrayBuffer': resizable, resize, detached, transfer, transferToFixedLength",
      source: "ts",
      startLineNumber: 155,
      startColumn: 23,
      endLineNumber: 155,
      endColumn: 35,
      modelVersionId: 25,
    },
  ];
}
