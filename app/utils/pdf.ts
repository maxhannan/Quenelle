import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { getPrepListById } from "./prepList.server";

type Preplist = Awaited<ReturnType<typeof getPrepListById>>;
export const getPdf = async (prepList: Preplist) => {
  if (!prepList) return null;
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text(prepList?.name, 14, 16);

  doc.setFontSize(12);
  doc.text(new Date(prepList.date).toDateString(), 14, 24);
  const data = prepList.taskGroups.map((tg) => ({
    head: [["", tg.name, "Unit", "On Hand", "Need"]],
    body: tg.tasks.map((t) => [
      t.completed ? "X" : "",
      t.name,
      t.prepUnit,
      t.onHand,
      t.prepQty,
    ]),
  }));

  for (let i = 0; i < data.length; i++) {
    autoTable(doc, {
      theme: "grid",
      ...data[i],
      columnStyles: {
        0: { cellWidth: 6 },
        1: { cellWidth: 100 },
        2: { cellWidth: 36 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
      },
      //@ts-ignore: next line is a hack to get around a bug in jspdf-autotable
      startY: i > 0 ? doc.lastAutoTable.finalY : 28,
      showHead: "firstPage",
      styles: { overflow: "hidden" },
    });
  }

  doc.save("table.pdf");

  return doc;
};
