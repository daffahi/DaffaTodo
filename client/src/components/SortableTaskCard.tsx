import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { TaskItem } from '../types/task'
import { taskDndId } from '../utils/dndIds'
import TaskCard from './TaskCard'

interface SortableTaskCardProps {
  task: TaskItem
}

function SortableTaskCard({ task }: SortableTaskCardProps) {
  // setActivatorNodeRef = tandai elemen mana yang menjadi "pegangan" drag.
  // dnd-kit hanya menerima Spasi/Enter dari keyboard kalau yang fokus adalah elemen pegangan ini sendiri
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
    // Lapisan luar: yang digeser dan diberi gaya posisi. Tidak menangkap mouse atau keyboard
    <div ref={setNodeRef} style={style} className={isDragging ? 'opacity-40' : ''}>
      {/* Lapisan dalam: pegangan drag. attributes + listeners dipasang di sini, bukan di lapisan luar.
          Event dari input atau tombol di dalam kartu (target-nya bukan elemen ini) diabaikan dnd-kit */}
      <div ref={setActivatorNodeRef} {...attributes} {...listeners} className="cursor-grab">
        <TaskCard task={task} />
      </div>
    </div>
  )
}

export default SortableTaskCard