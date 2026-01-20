import { motion } from "motion/react";
import { Edit, Trash2, MoreHorizontal, Star, ShoppingBag } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuHighlight,
  DropdownMenuHighlightItem,
} from "@/components/animate-ui/primitives/radix/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import WishlistDataTableSkeleton from "./WishlistDataTableSkeleton";
import EmptyState from "../common/EmptyState";
import SortableTableHead from "../shirt/SortableTableHead";

const WishlistDataTable = ({ items, isLoading, onEdit, onDelete, onAddToCollection, currentSort, onSortChange }) => {
  const { formatCurrency } = useCurrency();

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/30 dark:text-yellow-400",
      high: "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400",
    };
    return colors[priority] || colors.medium;
  };

  if (isLoading) {
    return <WishlistDataTableSkeleton rows={10} />;
  }

  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon={Star}
        title="Your wishlist is empty"
        description="Add shirts you want to collect"
      />
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-24">Priority</TableHead>
            <SortableTableHead
              sortKey="teamName"
              currentSort={currentSort}
              onSortChange={onSortChange}
            >
              Team
            </SortableTableHead>
            <SortableTableHead
              sortKey="season"
              currentSort={currentSort}
              onSortChange={onSortChange}
            >
              Season
            </SortableTableHead>
            <TableHead>Type</TableHead>
            <SortableTableHead
              sortKey="maxBudget"
              currentSort={currentSort}
              onSortChange={onSortChange}
              align="right"
            >
              Max Budget
            </SortableTableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <motion.tr
              key={item._id}
              className="border-b transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: index * 0.03,
              }}
            >
              {/* Priority */}
              <TableCell>
                <Badge
                  variant="secondary"
                  className={`capitalize text-xs ${getPriorityColor(item.priority)}`}
                >
                  {item.priority}
                </Badge>
              </TableCell>

              {/* Team */}
              <TableCell className="font-medium dark:text-slate-100">
                {item.teamName}
              </TableCell>

              {/* Season */}
              <TableCell className="text-slate-600 dark:text-slate-400">
                {item.season || "-"}
              </TableCell>

              {/* Type */}
              <TableCell>
                <span className="text-slate-600 dark:text-slate-400 capitalize text-sm">
                  {item.type === "any" ? "-" : item.type}
                </span>
              </TableCell>

              {/* Max Budget */}
              <TableCell className="text-right">
                {item.maxBudget > 0 ? (
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(item.maxBudget)}
                  </span>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </TableCell>

              {/* Notes */}
              <TableCell className="max-w-xs">
                {item.notes ? (
                  <span className="text-slate-600 dark:text-slate-400 text-sm line-clamp-1">
                    {item.notes}
                  </span>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </TableCell>

              {/* Actions */}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-8 w-8 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" side="bottom" sideOffset={4} className="w-48 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
                    <DropdownMenuHighlight className="inset-0 bg-slate-100 dark:bg-slate-800 rounded-md">
                      <DropdownMenuHighlightItem value="addToCollection">
                        <DropdownMenuItem
                          onClick={() => onAddToCollection(item)}
                          className="relative flex items-center gap-2 w-full px-2.5 py-2 text-sm cursor-pointer rounded-md outline-none text-slate-700 dark:text-slate-200 select-none"
                        >
                          <ShoppingBag className="h-4 w-4" />
                          Add to Collection
                        </DropdownMenuItem>
                      </DropdownMenuHighlightItem>
                    </DropdownMenuHighlight>
                    <DropdownMenuSeparator />
                    <DropdownMenuHighlight className="inset-0 bg-slate-100 dark:bg-slate-800 rounded-md">
                      <DropdownMenuHighlightItem value="edit">
                        <DropdownMenuItem
                          onClick={() => onEdit(item)}
                          className="relative flex items-center gap-2 w-full px-2.5 py-2 text-sm cursor-pointer rounded-md outline-none text-slate-700 dark:text-slate-200 select-none"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuHighlightItem>
                    </DropdownMenuHighlight>
                    <DropdownMenuSeparator />
                    <DropdownMenuHighlight className="inset-0 bg-red-100 dark:bg-red-900/30 rounded-md">
                      <DropdownMenuHighlightItem value="remove">
                        <DropdownMenuItem
                          onClick={() => onDelete(item._id)}
                          className="relative flex items-center gap-2 w-full px-2.5 py-2 text-sm cursor-pointer rounded-md outline-none text-red-600 dark:text-red-400 select-none"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuHighlightItem>
                    </DropdownMenuHighlight>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default WishlistDataTable;
