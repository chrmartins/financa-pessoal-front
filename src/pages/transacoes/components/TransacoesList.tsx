import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TransacaoResponse } from "@/types";
import { formatCurrency } from "@/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

interface TransacoesListProps {
  transacoes: TransacaoResponse[];
  isLoading?: boolean;
}

export function TransacoesList({
  transacoes,
  isLoading = false,
}: TransacoesListProps) {
  if (isLoading) {
    return (
      <Card className="card-gradient dark:bg-gray-800/95 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-500 dark:text-gray-400">
              Carregando transações...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header com contador */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Transações ({transacoes.length})
        </h2>
      </div>

      {/* Lista de transações */}
      {transacoes.length === 0 ? (
        <Card className="bg-white dark:bg-gray-800/95 border border-gray-300 dark:border-gray-700/50 shadow-md">
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhuma transação encontrada
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white dark:bg-gray-800/95 border border-gray-300 dark:border-gray-700/50 shadow-md">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200 dark:divide-gray-700/50">
              {transacoes.map((transacao: any) => (
                <div
                  key={transacao.id}
                  className="flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        transacao.tipo === "RECEITA"
                          ? "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
                          : "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transacao.tipo === "RECEITA" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                        {transacao.descricao}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span>
                          {transacao.categoria?.nome || "Sem categoria"}
                        </span>
                        <span>•</span>
                        <span>{transacao.dataTransacao}</span>
                      </div>
                      {transacao.observacoes && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {transacao.observacoes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-bold text-lg ${
                        transacao.tipo === "RECEITA"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transacao.tipo === "RECEITA" ? "+" : "-"}
                      {formatCurrency(Math.abs(transacao.valor))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
