import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";
import { useState } from "react";

interface PeriodDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (dataInicio: Date, dataFim: Date) => void;
}

export function PeriodDialog({ open, onClose, onApply }: PeriodDialogProps) {
  const hoje = new Date();
  const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

  const [dataInicio, setDataInicio] = useState<string>(
    primeiroDiaMes.toISOString().split("T")[0]
  );
  const [dataFim, setDataFim] = useState<string>(
    hoje.toISOString().split("T")[0]
  );
  const [erro, setErro] = useState<string>("");

  const handleApply = () => {
    if (!dataInicio || !dataFim) {
      setErro("Por favor, preencha ambas as datas");
      return;
    }

    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);

    if (inicio > fim) {
      setErro("A data inicial deve ser anterior à data final");
      return;
    }

    // Limpar erro e aplicar
    setErro("");
    onApply(inicio, fim);
    onClose();
  };

  const handleClose = () => {
    setErro("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-violet-600" />
            Selecionar Período Personalizado
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Data Início */}
          <div className="space-y-2">
            <Label htmlFor="dataInicio">Data Inicial</Label>
            <Input
              id="dataInicio"
              type="date"
              value={dataInicio}
              onChange={(e) => {
                setDataInicio(e.target.value);
                setErro("");
              }}
              max={hoje.toISOString().split("T")[0]}
            />
          </div>

          {/* Data Fim */}
          <div className="space-y-2">
            <Label htmlFor="dataFim">Data Final</Label>
            <Input
              id="dataFim"
              type="date"
              value={dataFim}
              onChange={(e) => {
                setDataFim(e.target.value);
                setErro("");
              }}
              max={hoje.toISOString().split("T")[0]}
            />
          </div>

          {/* Mensagem de Erro */}
          {erro && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
              {erro}
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              className="bg-violet-600 hover:bg-violet-700"
            >
              Aplicar Período
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
