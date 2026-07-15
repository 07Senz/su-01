"use client";

export function FormPillButton({
  label,
  active,
  onClick,
  className,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        className ||
        `px-4 py-2 text-xs font-extrabold rounded-xl transition-all shadow-sm border border-slate-200/70
        bg-gradient-to-r from-slate-200 via-slate-100 to-white hover:from-slate-300 hover:via-slate-150 hover:to-white text-slate-900`
      }
      style={
        active
          ? {
              backgroundImage:
                "linear-gradient(90deg, #cbd5e1 0%, #f8fafc 50%, #94a3b8 100%)",
            }
          : undefined
      }
    >
      {label}
    </button>
  );
}

