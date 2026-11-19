import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { TaskItem } from '../types/task'
import { taskDndId } from '../utils/dndIds'
import TaskCard from './TaskCard'

interface SortableTaskCardProps {
  task: TaskItem
}

function SortableTaskCard({ task }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: taskDndId(task.id),
    data: { task },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? 'opacity-40' : ''}>
      <div ref={setActivatorNodeRef} {...attributes} {...listeners} className="cursor-grab">
        <TaskCard task={task} />
      </div>
    </div>
  )
}

export default SortableTaskCard