import { TransacaoModal } from "@/components/transacaoModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TransacaoResponse } from "@/types";
import { formatCurrency, formatDateWithTime } from "@/utils";
import { Edit2, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { DeleteTransacaoModal } from "./DeleteTransacaoModal";

interface TransacoesListProps {
  transacoes: TransacaoResponse[];
  isLoading?: boolean;
}

export function TransacoesList({
  transacoes,
  isLoading = false,
}: TransacoesListProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTransacao, setSelectedTransacao] =
    useState<TransacaoResponse | null>(null);

  const handleEditClick = (transacao: TransacaoResponse) => {
    setSelectedTransacao(transacao);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (transacao: TransacaoResponse) => {
    setSelectedTransacao(transacao);
    setDeleteModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedTransacao(null);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedTransacao(null);
  };

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
        <>
          <Card className="bg-white dark:bg-gray-800/95 border border-gray-300 dark:border-gray-700/50 shadow-md">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200 dark:divide-gray-700/50">
                {transacoes.map((transacao) => (
                  <div
                    key={transacao.id}
                    className="flex items-center justify-between p-3 sm:p-4 md:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors gap-2"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
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
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                          {transacao.descricao}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <span className="truncate">
                            {transacao.categoria?.nome || "Sem categoria"}
                          </span>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline">
                            {formatDateWithTime(transacao.dataCriacao)}
                          </span>
                        </div>
                        {transacao.observacoes && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                            {transacao.observacoes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p
                          className={`font-bold text-sm sm:text-base md:text-lg whitespace-nowrap ${
                            transacao.tipo === "RECEITA"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {transacao.tipo === "RECEITA" ? "+" : "-"}
                          {formatCurrency(Math.abs(transacao.valor))}
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditClick(transacao)}
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Edit2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteClick(transacao)}
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Transações ({transacoes.length})
            </h2>
          </div>
        </>
      )}

      {/* Modais */}
      <TransacaoModal
        transacao={selectedTransacao}
        open={editModalOpen}
        onClose={closeEditModal}
      />
      <DeleteTransacaoModal
        transacao={selectedTransacao}
        open={deleteModalOpen}
        onClose={closeDeleteModal}
      />
    </div>
  );
}
