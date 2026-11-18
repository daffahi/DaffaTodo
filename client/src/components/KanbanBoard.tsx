// Semua logika drag & drop ada di sini: menyimpan salinan kolom, mengubahnya selama digeser, dan mengirim hasilnya ke server saat dilepas.

import { useState } from 'react'
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getErrorMessage } from '../api/errors'
import { moveTask } from '../api/tasks'
import type { BoardDetail } from '../types/board'
import type { Column } from '../types/column'
import type { MoveTaskRequest, TaskItem } from '../types/task'
import { columnDndId, taskDndId } from '../utils/dndIds'
import AddColumnForm from './AddColumnForm'
import KanbanColumn from './KanbanColumn'
import TaskCard from './TaskCard'

// Mencari kolom dari id dnd-kit. Id-nya bisa id tugas ("task-10") atau id kolom ("column-4")
function findColumn(columns: Column[], dndId: string): Column | undefined {
  return columns.find(
    (column) =>
      columnDndId(column.id) === dndId ||
      column.tasks.some((task) => taskDndId(task.id) === dndId),
  )
}

// Memindahkan tugas ke kolom lain di data lokal, mengembalikan salinan kolom yang baru.
// Kalau tugas masih di kolom yang sama, data dikembalikan apa adanya
function moveToColumn(
  columns: Column[],
  activeId: string,
  overId: string,
  isBelowOver: boolean,
): Column[] {
  const from = findColumn(columns, activeId)
  const to = findColumn(columns, overId)

  if (!from || !to || from.id === to.id) {
    return columns
  }

  const task = from.tasks.find((t) => taskDndId(t.id) === activeId)
  if (!task) {
    return columns
  }

  // Kalau kartu ada di atas tugas lain, sisipkan di situ (di bawahnya kalau posisinya sudah lewat setengah).
  // overIndex -1 berarti kartu ada di atas area kolom, bukan di atas tugas: taruh paling bawah
  const overIndex = to.tasks.findIndex((t) => taskDndId(t.id) === overId)
  const insertAt = overIndex >= 0 ? overIndex + (isBelowOver ? 1 : 0) : to.tasks.length

  return columns.map((column) => {
    if (column.id === from.id) {
      return { ...column, tasks: column.tasks.filter((t) => t.id !== task.id) }
    }
    if (column.id === to.id) {
      const tasks = [...column.tasks]
      tasks.splice(insertAt, 0, task)
      return { ...column, tasks }
    }
    return column
  })
}

interface KanbanBoardProps {
  board: BoardDetail
}

function KanbanBoard({ board }: KanbanBoardProps) {
  // Salinan kolom untuk tampilan. Inilah yang berubah selama kartu digeser
  const [columns, setColumns] = useState(board.columns)

  // Kalau data dari server berganti (setelah tambah/hapus/refetch), salinan lokal ikut diperbarui.
  // Perbandingan ini dilakukan saat render, cara yang dianjurkan React dibanding useEffect
  const [syncedColumns, setSyncedColumns] = useState(board.columns)
  if (board.columns !== syncedColumns) {
    setSyncedColumns(board.columns)
    setColumns(board.columns)
  }

  // Tugas yang sedang dipegang, dipakai untuk menggambar salinan yang melayang
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null)

  const queryClient = useQueryClient()

  const moveMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: MoveTaskRequest }) => moveTask(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board'] }),
    // Gagal disimpan: kembalikan tampilan ke data server
    onError: () => setColumns(board.columns),
  })

  const sensors = useSensors(
    // distance: 5 = kartu baru dianggap digeser setelah bergerak 5 piksel.
    // Tanpa ini, klik tombol Delete di kartu terbaca sebagai awal drag
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    // Menggeser lewat keyboard (Tab ke kartu, Spasi untuk mengangkat, panah untuk menggeser)
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragStart = ({ active }: DragStartEvent) => {
    // Objek tugas dititipkan di useSortable lewat data: { task }
    setActiveTask((active.data.current?.task as TaskItem | undefined) ?? null)
  }

  // Dipanggil terus selama kartu digeser. Di sini kartu dipindah antar kolom di data lokal
  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) {
      return
    }

    // Apakah bagian atas kartu yang digeser sudah melewati bagian bawah item di bawahnya?
    const activeRect = active.rect.current.translated
    const isBelowOver = !!activeRect && activeRect.top > over.rect.top + over.rect.height

    setColumns((prev) => moveToColumn(prev, String(active.id), String(over.id), isBelowOver))
  }

  // Dipanggil saat kartu dilepas
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null)

    // Dilepas di luar area mana pun: batalkan, kembalikan ke data server
    if (!over) {
      setColumns(board.columns)
      return
    }

    const activeId = String(active.id)
    const overId = String(over.id)
    let next = columns

    // Urutan di kolom yang sama: pindah antar kolom sudah ditangani handleDragOver,
    // jadi di sini tinggal menukar urutan di dalam kolom tempat kartu sekarang berada
    const column = findColumn(next, activeId)
    if (!column) {
      return
    }

    const oldIndex = column.tasks.findIndex((t) => taskDndId(t.id) === activeId)
    const newIndex = column.tasks.findIndex((t) => taskDndId(t.id) === overId)

    if (newIndex >= 0 && oldIndex !== newIndex) {
      next = next.map((c) =>
        c.id === column.id ? { ...c, tasks: arrayMove(c.tasks, oldIndex, newIndex) } : c,
      )
      setColumns(next)
    }

    // Posisi akhir tugas: kolom mana, urutan ke berapa
    const finalColumn = findColumn(next, activeId)
    if (!finalColumn) {
      return
    }
    const position = finalColumn.tasks.findIndex((t) => taskDndId(t.id) === activeId)

    // Dibandingkan dengan posisi awal di server. Kalau sama saja, tidak perlu memanggil API
    const originalColumn = findColumn(board.columns, activeId)
    const originalPosition = originalColumn?.tasks.findIndex((t) => taskDndId(t.id) === activeId)
    if (originalColumn?.id === finalColumn.id && originalPosition === position) {
      return
    }

    // Id tugas diambil dari objek yang dititipkan, bukan dari memotong teks "task-10"
    const taskId = (active.data.current?.task as TaskItem).id
    moveMutation.mutate({ id: taskId, data: { boardColumnId: finalColumn.id, position } })
  }

  // Dibatalkan (misalnya tekan Esc): kembalikan ke data server
  const handleDragCancel = () => {
    setActiveTask(null)
    setColumns(board.columns)
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="mt-6 flex items-start gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn key={column.id} column={column} />
          ))}

          <AddColumnForm boardId={board.id} />
        </div>

        {/* Salinan kartu yang melayang mengikuti kursor */}
        <DragOverlay>{activeTask ? <TaskCard task={activeTask} /> : null}</DragOverlay>
      </DndContext>

      {moveMutation.isError && (
        <p className="text-sm text-red-600">{getErrorMessage(moveMutation.error)}</p>
      )}
    </>
  )
}

export default KanbanBoard