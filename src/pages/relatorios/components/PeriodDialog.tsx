import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";

interface PeriodDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: (dataInicio: Date, dataFim: Date) => void;
}

export function PeriodDialog({ open, onClose, onApply }: PeriodDialogProps) {
  const hoje = new Date();
  const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

  const [dataInicio, setDataInicio] = useState<Date | undefined>(
    primeiroDiaMes
  );
  const [dataFim, setDataFim] = useState<Date | undefined>(hoje);
  const [erro, setErro] = useState<string>("");
  const [popoverInicioOpen, setPopoverInicioOpen] = useState(false);
  const [popoverFimOpen, setPopoverFimOpen] = useState(false);

  const handleApply = () => {
    if (!dataInicio || !dataFim) {
      setErro("Por favor, selecione ambas as datas");
      return;
    }

    if (dataInicio > dataFim) {
      setErro("A data inicial deve ser anterior à data final");
      return;
    }

    // Limpar erro e aplicar
    setErro("");
    onApply(dataInicio, dataFim);
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
            <CalendarIcon className="w-5 h-5 text-violet-600" />
            Selecionar Período Personalizado
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Data Início */}
          <div className="space-y-2">
            <Label>Data Inicial</Label>
            <Popover
              open={popoverInicioOpen}
              onOpenChange={setPopoverInicioOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dataInicio && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataInicio ? (
                    format(dataInicio, "PPP", { locale: ptBR })
                  ) : (
                    <span>Selecione a data inicial</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dataInicio}
                  onSelect={(date) => {
                    setDataInicio(date);
                    setErro("");
                    setPopoverInicioOpen(false);
                  }}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Data Fim */}
          <div className="space-y-2">
            <Label>Data Final</Label>
            <Popover open={popoverFimOpen} onOpenChange={setPopoverFimOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dataFim && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataFim ? (
                    format(dataFim, "PPP", { locale: ptBR })
                  ) : (
                    <span>Selecione a data final</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dataFim}
                  onSelect={(date) => {
                    setDataFim(date);
                    setErro("");
                    setPopoverFimOpen(false);
                  }}
                  disabled={(date) => (dataInicio ? date < dataInicio : false)}
                  initialFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
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
