import ShirtCard from "./ShirtCard";

const ShirtGrid = ({ shirts, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-slate-200 aspect-[3/4] rounded-t-lg"></div>
            <div className="bg-white p-4 rounded-b-lg">
              <div className="h-4 bg-slate-200 rounded mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!shirts || shirts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚽</div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          No shirts found
        </h3>
        <p className="text-slate-600">
          Start building your collection by adding your first shirt!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {shirts.map((shirt) => (
        <ShirtCard key={shirt._id} shirt={shirt} />
      ))}
    </div>
  );
};

export default ShirtGrid;
