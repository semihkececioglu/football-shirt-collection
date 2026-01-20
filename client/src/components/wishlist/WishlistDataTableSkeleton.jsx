import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const WishlistDataTableSkeleton = ({ rows = 10 }) => {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-24">Priority</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Season</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Max Budget</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, index) => (
            <TableRow key={index} className="animate-pulse">
              {/* Priority skeleton */}
              <TableCell>
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-16" />
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
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-12" />
              </TableCell>

              {/* Max Budget skeleton */}
              <TableCell className="text-right">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16 ml-auto" />
              </TableCell>

              {/* Notes skeleton */}
              <TableCell>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-48" />
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

export default WishlistDataTableSkeleton;
