export default function CurrencyImportRow({
  currency,
  disabled,
  onImport
}: any) {
  return (
    <div
      className={`px-8 py-2.5 flex justify-between items-center hover:bg-[rgba(151,154,190,0.1)] transition-colors ${
        disabled ? 'opacity-60 cursor-not-allowed' : 'opacity-100 cursor-pointer'
      }`}
      style={{
        cursor: !disabled
          ? "url('../../public/images/cursor.svg') 12 0"
          : 'not-allowed'
      }}
    >
      <div className="flex items-center gap-1.5">
        <div className="text-lg font-medium">{currency.symbol}</div>
        <div className="text-sm opacity-50">{currency.name}</div>
      </div>
      <button
        className="rounded-md bg-[#1b1e27] w-[103px] h-9 flex-shrink-0 text-white text-base font-semibold border-none"
        onClick={() => {
          if (!disabled) onImport?.();
        }}
      >
        Import
      </button>
    </div>
  );
}
