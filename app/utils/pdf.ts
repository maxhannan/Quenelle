import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { getPrepListById } from "./prepList.server";

type Preplist = Awaited<ReturnType<typeof getPrepListById>>;
export const getPdf = async (prepList: Preplist) => {
  if (!prepList) return null;
  const doc = new jsPDF();
  doc.setFontSize(24);
  doc.text(prepList?.name, 14, 20);

  doc.setFontSize(12);
  doc.text(new Date(prepList.date).toDateString(), 14, 28);
  const data = prepList.taskGroups.map((tg) => ({
    head: [["", tg.name, "Unit", "Inv", "Prep"]],
    body: tg.tasks.map((t) => [
      t.completed ? "X" : "",
      t.name,
      t.prepUnit,
      t.onHand,
      t.prepQty,
    ]),
  }));

  let lastys = [];

  for (let i = 0; i < data.length; i++) {
    const margin = i % 2 === 0 ? { right: 109 } : { left: 109 };
    autoTable(doc, {
      theme: "grid",
      ...data[i],
      bodyStyles: { fontSize: 8 },
      headStyles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 5 },
        1: { cellWidth: 50 },
        2: { cellWidth: 18 },
        3: { cellWidth: 10 },
        4: { cellWidth: 10 },
      },
      margin: margin,
      startY: i > 1 ? lastys[i - 2] + 5 : 32,
      showHead: "firstPage",
      styles: { overflow: "hidden" },
    });
    // @ts-ignore: next line is a hack to get around a bug in jspdf-autotable
    lastys.push(doc.lastAutoTable.finalY);
  }

  doc.save("table.pdf");

  return doc;
};
