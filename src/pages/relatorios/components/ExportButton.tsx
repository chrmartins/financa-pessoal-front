import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CategoryExpenseData } from "@/hooks/queries/transacoes/use-category-expenses";
import { exportToCSV, exportToPDF } from "@/utils/export-relatorios";
import { Download, FileText, Table } from "lucide-react";
import { toast } from "sonner";

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

interface ExportButtonProps {
  periodo: string;
  metricas?: MetricasData;
  categorias?: CategoryExpenseData[];
  topDespesas?: TopExpenseData[];
  disabled?: boolean;
}

export function ExportButton({
  periodo,
  metricas,
  categorias,
  topDespesas,
  disabled = false,
}: ExportButtonProps) {
  const handleExportPDF = () => {
    try {
      exportToPDF({
        periodo,
        metricas,
        categorias,
        topDespesas,
      });
      toast.success("Relatório PDF exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast.error("Erro ao exportar relatório em PDF");
    }
  };

  const handleExportCSV = () => {
    try {
      exportToCSV({
        periodo,
        metricas,
        categorias,
        topDespesas,
      });
      toast.success("Relatório CSV exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      toast.error("Erro ao exportar relatório em CSV");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          disabled={disabled}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            disabled
              ? "opacity-50 cursor-not-allowed bg-slate-200 dark:bg-slate-700 text-gray-900 dark:text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Exportar</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={handleExportPDF}
          className="gap-2 cursor-pointer"
        >
          <FileText className="h-4 w-4" />
          Exportar como PDF
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleExportCSV}
          className="gap-2 cursor-pointer"
        >
          <Table className="h-4 w-4" />
          Exportar como CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
