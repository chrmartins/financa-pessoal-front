import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export function TrendChart() {
  return (
    <Card className="card-gradient dark:bg-gray-800/95 dark:border-gray-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 dark:text-gray-100">
          <TrendingUp className="h-5 w-5" />
          Tendência Mensal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Gráfico de tendência será implementado
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
