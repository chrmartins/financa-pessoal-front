import React, { forwardRef, useState } from "react";
import { cn } from "../../utils";
import { Input } from "./input";

interface CurrencyInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  value?: number;
  onChange?: (value: number) => void;
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, onChange, value, ...props }, ref) => {
    const [inputValue, setInputValue] = useState("");

    // Formatar número para display com R$
    const formatForDisplay = (num: number): string => {
      if (isNaN(num) || num === 0) return "";

      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(num);
    };

    // Converter input string para número
    const parseInput = (str: string): number => {
      // Remove tudo exceto números
      const numbersOnly = str.replace(/\D/g, "");

      if (!numbersOnly) return 0;

      // Converte centavos para reais (divide por 100)
      const value = parseInt(numbersOnly) / 100;
      return value;
    };

    // Valor atual para display
    const displayValue = React.useMemo(() => {
      if (value && value > 0) {
        return formatForDisplay(value);
      }
      return inputValue || "";
    }, [value, inputValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // Se está apagando, permite valor vazio
      if (newValue === "") {
        setInputValue("");
        onChange?.(0);
        return;
      }

      // Parse do valor
      const numericValue = parseInput(newValue);

      // Formata para mostrar na tela
      const formatted = formatForDisplay(numericValue);
      setInputValue(formatted);

      // Chama onChange com o valor numérico
      onChange?.(numericValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Permitir teclas de controle
      const allowedKeys = [
        "Backspace",
        "Delete",
        "Tab",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End",
      ];

      if (allowedKeys.includes(e.key)) return;

      // Permitir Ctrl+A, Ctrl+C, etc.
      if (e.ctrlKey || e.metaKey) return;

      // Permitir apenas números
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={cn("text-right", className)}
        placeholder="R$ 0,00"
      />
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
