import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Column } from '../types/column'
import { columnDndId, taskDndId } from '../utils/dndIds'
import AddTaskForm from './AddTaskForm'
import ColumnHeader from './ColumnHeader'
import SortableTaskCard from './SortableTaskCard'

interface KanbanColumnProps {
  column: Column
}

function KanbanColumn({ column }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: columnDndId(column.id) })

  return (
    <div ref={setNodeRef} className="w-72 shrink-0 rounded-lg bg-slate-200 p-3">
      <ColumnHeader column={column} />

      <div className="space-y-2">
        {column.tasks.length === 0 && (
          <p className="px-1 text-sm text-slate-500">No tasks yet.</p>
        )}

        <SortableContext
          items={column.tasks.map((task) => taskDndId(task.id))}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        <AddTaskForm columnId={column.id} />
      </div>
    </div>
  )
}

export default KanbanColumn