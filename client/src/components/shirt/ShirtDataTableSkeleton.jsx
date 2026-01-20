import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ShirtDataTableSkeleton = ({ rows = 10 }) => {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12"></TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Season</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Competition</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow key={index} className="animate-pulse">
              {/* Favorite skeleton */}
              <TableCell>
                <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto" />
              </TableCell>

              {/* Team skeleton */}
              <TableCell>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32" />
              </TableCell>

              {/* Season skeleton */}
              <TableCell>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16" />
              </TableCell>

              {/* Type skeleton */}
              <TableCell>
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-14" />
              </TableCell>

              {/* Brand skeleton */}
              <TableCell>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20" />
              </TableCell>

              {/* Competition skeleton */}
              <TableCell>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
              </TableCell>

              {/* Size skeleton */}
              <TableCell>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-8" />
              </TableCell>

              {/* Condition skeleton */}
              <TableCell>
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-16" />
              </TableCell>

              {/* Price skeleton */}
              <TableCell className="text-right">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16 ml-auto" />
              </TableCell>

              {/* Actions skeleton */}
              <TableCell>
                <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-md mx-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ShirtDataTableSkeleton;
