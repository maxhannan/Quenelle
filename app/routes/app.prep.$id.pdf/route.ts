import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
export async function loader({ params }: LoaderArgs) {
  const doc = new jsPDF();
  autoTable(doc, {
    head: [["Name", "Email", "Country"]],
    body: [
      ["David", "david@example.com", "Sweden"],
      ["Castille", "castille@example.com", "Spain"],
      // ...
    ],
  });

  doc.save("table.pdf");

  return new Response(doc.output(), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}
