import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { TransacaoResponse } from "@/types";
import { formatCurrency, formatDateWithTime } from "@/utils";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RecentTransactionsProps {
  transacoes: TransacaoResponse[];
  isLoading?: boolean;
}

export function RecentTransactions({
  transacoes,
  isLoading = false,
}: RecentTransactionsProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card className="card-gradient dark:bg-gray-800/95 dark:border-gray-700/50">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">
            Transações Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-3">
            <Spinner size="md" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Carregando transações...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-gradient dark:bg-gray-800/95 dark:border-gray-700/50">
      <CardHeader>
        <CardTitle className="dark:text-gray-100">
          Transações Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {transacoes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhuma transação encontrada
              </p>
            </div>
          ) : (
            transacoes.map((transacao) => (
              <div
                key={transacao.id}
                className="flex items-center justify-between p-2 bg-white/50 dark:bg-gray-700/50 rounded-md border border-white/20 dark:border-gray-600/30"
              >
                <div className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`p-1.5 rounded-md ${
                        transacao.tipo === "RECEITA"
                          ? "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
                          : "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transacao.tipo === "RECEITA" ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                    </div>
                    {transacao.categoria?.cor && (
                      <div
                        className="h-2 w-2 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: transacao.categoria.cor,
                        }}
                        title={transacao.categoria.nome}
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      {transacao.descricao}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {transacao.categoria?.nome || "Sem categoria"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold text-sm ${
                      transacao.tipo === "RECEITA"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {transacao.tipo === "RECEITA" ? "+" : "-"}
                    {formatCurrency(Math.abs(transacao.valor))}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatDateWithTime(transacao.dataCriacao)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/transacoes")}
          >
            Ver Todas as Transações
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
