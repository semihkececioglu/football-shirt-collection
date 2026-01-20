import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, Upload, GripVertical } from "lucide-react";

// Individual sortable image item
const SortableImageItem = ({ id, src, index, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative aspect-square group rounded-lg overflow-hidden border ${
        isDragging
          ? "border-blue-500 shadow-lg"
          : "border-slate-200 dark:border-slate-700"
      }`}
    >
      <img
        src={src}
        alt={`Image ${index + 1}`}
        className="w-full h-full object-cover"
      />

      {/* Drag handle overlay */}
      <div
        {...attributes}
        {...listeners}
        className="absolute inset-0 cursor-grab active:cursor-grabbing flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors"
      >
        <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full p-1.5">
          <GripVertical className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
        className="absolute top-1 right-1 bg-red-500/90 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
      >
        <X className="w-3 h-3" />
      </button>

      {/* Index badge */}
      <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
        {index + 1}
      </div>
    </div>
  );
};

// Main sortable image grid component
const SortableImageGrid = ({
  images = [],
  previews = [],
  onReorder,
  onRemove,
  onAdd,
  maxImages = 5,
  columns = "grid-cols-3 sm:grid-cols-5",
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Generate unique IDs for each image
  const imageIds = previews.map((_, index) => `image-${index}`);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = imageIds.indexOf(active.id);
      const newIndex = imageIds.indexOf(over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(oldIndex, newIndex);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={imageIds} strategy={rectSortingStrategy}>
        <div className={`grid ${columns} gap-2`}>
          {previews.map((preview, index) => (
            <SortableImageItem
              key={imageIds[index]}
              id={imageIds[index]}
              src={preview}
              index={index}
              onRemove={onRemove}
            />
          ))}

          {images.length < maxImages && onAdd && (
            <label className="aspect-square border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onAdd}
                className="hidden"
              />
              <Upload className="w-5 h-5 text-slate-400 dark:text-slate-500 mb-1" />
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Add
              </span>
            </label>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default SortableImageGrid;
