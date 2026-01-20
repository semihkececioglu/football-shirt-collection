import { Shirt } from "lucide-react";
import { motion } from "motion/react";
import ShirtCard from "./ShirtCard";
import ShirtCardSkeleton from "./ShirtCardSkeleton";
import EmptyState from "../common/EmptyState";

const ShirtGrid = ({ shirts, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <ShirtCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!shirts || shirts.length === 0) {
    return (
      <EmptyState
        icon={Shirt}
        title="No shirts found"
        description="Start building your collection by adding your first shirt!"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {shirts.map((shirt, index) => (
        <motion.div
          key={shirt._id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            delay: index * 0.03,
          }}
        >
          <ShirtCard shirt={shirt} />
        </motion.div>
      ))}
    </div>
  );
};

export default ShirtGrid;
