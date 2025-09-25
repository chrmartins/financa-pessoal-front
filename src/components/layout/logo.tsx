export function Logo() {
  return (
    <>
      {/* Logo para tema claro (gradiente escuro) */}
      <img
        src="/nocontrole-logo.svg"
        alt="NoControle"
        className="h-12 w-auto transition-opacity duration-200 hover:opacity-80 dark:hidden"
      />

      {/* Logo para tema escuro (gradiente claro) */}
      <img
        src="/nocontrole-logo-dark.svg"
        alt="NoControle"
        className="h-12 w-auto transition-opacity duration-200 hover:opacity-80 hidden dark:block"
      />
    </>
  );
}
