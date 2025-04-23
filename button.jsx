
export function Button({ onClick, children, variant }) {
  return (
    <button
      onClick={onClick}
      className={variant === "default" ? "bg-blue-500 text-white px-4 py-2 rounded" : "border px-4 py-2 rounded"}
    >
      {children}
    </button>
  );
}
