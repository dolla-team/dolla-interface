import Refresh from "@/components/icons/refresh";

export default function RefreshBtn({
  refreshing,
  handleRefresh
}: {
  refreshing: boolean;
  handleRefresh: () => void;
}) {
  return (
    <button className="button" onClick={handleRefresh}>
      <Refresh refreshing={refreshing} size={16} />
    </button>
  );
}
