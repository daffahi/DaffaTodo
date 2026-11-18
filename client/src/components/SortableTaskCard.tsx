// Pembungkus TaskCard yang membuatnya bisa digeser. TaskCard sendiri tidak diubah.

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { TaskItem } from '../types/task'
import { taskDndId } from '../utils/dndIds'
import TaskCard from './TaskCard'

interface SortableTaskCardProps {
  task: TaskItem
}

function SortableTaskCard({ task }: SortableTaskCardProps) {
  // useSortable mengembalikan semua yang dibutuhkan agar elemen ini bisa digeser.
  // data: { task } menitipkan objek tugas supaya bisa dibaca lagi saat event drag
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: taskDndId(task.id),
    data: { task },
  })

  // Posisi sementara selama digeser, dihitung dnd-kit
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    // setNodeRef = daftarkan elemen ini ke dnd-kit
    // attributes + listeners = aksesibilitas dan penangkap mouse/sentuhan/keyboard
    // opacity-40 pada kartu asli supaya terlihat "ditinggalkan" saat salinannya melayang
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab ${isDragging ? 'opacity-40' : ''}`}
    >
      <TaskCard task={task} />
    </div>
  )
}

export default SortableTaskCard