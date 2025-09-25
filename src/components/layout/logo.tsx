import { DollarSign } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
        <DollarSign className="h-5 w-5 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-gray-900">FinançasPro</span>
        <span className="text-xs text-gray-600">Controle Total</span>
      </div>
    </div>
  );
}
