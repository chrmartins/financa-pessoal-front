import type { CategoryExpenseData } from "@/hooks/queries/transacoes/use-category-expenses";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Interface para estender jsPDF com lastAutoTable
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

interface MetricasData {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  crescimentoReceitas: number;
  crescimentoDespesas: number;
  crescimentoSaldo: number;
}

interface TopExpenseData {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  categoryColor: string;
}

interface ExportData {
  periodo: string;
  metricas?: MetricasData;
  categorias?: CategoryExpenseData[];
  topDespesas?: TopExpenseData[];
}

// Função para formatar moeda
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Função para formatar data
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("pt-BR");
};

// Função para formatar percentual
const formatPercent = (value: number): string => {
  const formatted = value.toFixed(2);
  return value > 0 ? `+${formatted}%` : `${formatted}%`;
};

/**
 * Exporta relatório em PDF
 */
export function exportToPDF(data: ExportData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  let yPosition = 20;

  // Título
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Relatório Financeiro", pageWidth / 2, yPosition, {
    align: "center",
  });

  yPosition += 10;

  // Período
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Período: ${data.periodo}`, pageWidth / 2, yPosition, {
    align: "center",
  });

  yPosition += 15;

  // Seção: Resumo Financeiro
  if (data.metricas) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Resumo Financeiro", 14, yPosition);
    yPosition += 10;

    autoTable(doc, {
      startY: yPosition,
      head: [["Métrica", "Valor", "Variação"]],
      body: [
        [
          "Receitas",
          formatCurrency(data.metricas.totalReceitas),
          formatPercent(data.metricas.crescimentoReceitas),
        ],
        [
          "Despesas",
          formatCurrency(data.metricas.totalDespesas),
          formatPercent(data.metricas.crescimentoDespesas),
        ],
        [
          "Saldo",
          formatCurrency(data.metricas.saldo),
          formatPercent(data.metricas.crescimentoSaldo),
        ],
      ],
      theme: "grid",
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 60, halign: "right" },
        2: { cellWidth: 50, halign: "right" },
      },
    });

    yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 15;
  }

  // Seção: Despesas por Categoria
  if (data.categorias && data.categorias.length > 0) {
    // Verificar se precisa de nova página
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Despesas por Categoria", 14, yPosition);
    yPosition += 10;

    autoTable(doc, {
      startY: yPosition,
      head: [["Categoria", "Valor", "Percentual"]],
      body: data.categorias.map((cat) => [
        cat.name,
        formatCurrency(cat.value),
        `${cat.percentage.toFixed(2)}%`,
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 50, halign: "right" },
        2: { cellWidth: 40, halign: "right" },
      },
    });

    yPosition = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 15;
  }

  // Seção: Maiores Despesas
  if (data.topDespesas && data.topDespesas.length > 0) {
    // Verificar se precisa de nova página
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Maiores Despesas (Top 10)", 14, yPosition);
    yPosition += 10;

    autoTable(doc, {
      startY: yPosition,
      head: [["#", "Descrição", "Categoria", "Data", "Valor"]],
      body: data.topDespesas.map((expense, index) => [
        (index + 1).toString(),
        expense.description,
        expense.category,
        formatDate(expense.date),
        formatCurrency(expense.amount),
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" },
        1: { cellWidth: 60 },
        2: { cellWidth: 40 },
        3: { cellWidth: 30, halign: "center" },
        4: { cellWidth: 40, halign: "right" },
      },
    });
  }

  // Rodapé
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Gerado em ${new Date().toLocaleString(
        "pt-BR"
      )} - Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  // Salvar PDF
  const fileName = `relatorio-financeiro-${new Date().getTime()}.pdf`;
  doc.save(fileName);
}

/**
 * Exporta relatório em CSV
 */
export function exportToCSV(data: ExportData): void {
  let csvContent = "";

  // Cabeçalho
  csvContent += `Relatório Financeiro\n`;
  csvContent += `Período: ${data.periodo}\n`;
  csvContent += `Gerado em: ${new Date().toLocaleString("pt-BR")}\n\n`;

  // Resumo Financeiro
  if (data.metricas) {
    csvContent += `RESUMO FINANCEIRO\n`;
    csvContent += `Métrica,Valor,Variação\n`;
    csvContent += `Receitas,${formatCurrency(
      data.metricas.totalReceitas
    )},${formatPercent(data.metricas.crescimentoReceitas)}\n`;
    csvContent += `Despesas,${formatCurrency(
      data.metricas.totalDespesas
    )},${formatPercent(data.metricas.crescimentoDespesas)}\n`;
    csvContent += `Saldo,${formatCurrency(data.metricas.saldo)},${formatPercent(
      data.metricas.crescimentoSaldo
    )}\n\n`;
  }

  // Despesas por Categoria
  if (data.categorias && data.categorias.length > 0) {
    csvContent += `DESPESAS POR CATEGORIA\n`;
    csvContent += `Categoria,Valor,Percentual\n`;
    data.categorias.forEach((cat) => {
      csvContent += `${cat.name},${formatCurrency(
        cat.value
      )},${cat.percentage.toFixed(2)}%\n`;
    });
    csvContent += `\n`;
  }

  // Maiores Despesas
  if (data.topDespesas && data.topDespesas.length > 0) {
    csvContent += `MAIORES DESPESAS (TOP 10)\n`;
    csvContent += `#,Descrição,Categoria,Data,Valor\n`;
    data.topDespesas.forEach((expense, index) => {
      csvContent += `${index + 1},${expense.description},${
        expense.category
      },${formatDate(expense.date)},${formatCurrency(expense.amount)}\n`;
    });
  }

  // Criar blob e fazer download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `relatorio-financeiro-${new Date().getTime()}.csv`
  );
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
