export function Logo({
  size = "default",
}: {
  size?: "small" | "default" | "large";
}) {
  const sizes = {
    small: "text-xl",
    default: "text-2xl",
    large: "text-4xl",
  };

  return (
    <div className={`font-bold ${sizes[size]}`}>
      <span className="text-purple-500 dark:text-purple-400">No</span>
      <span className="text-gray-900 dark:text-white">Controle</span>
      <span className="text-green-500 dark:text-green-400 ml-1">✓</span>
    </div>
  );
}
