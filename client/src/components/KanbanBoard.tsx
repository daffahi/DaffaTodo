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

function findColumn(columns: Column[], dndId: string): Column | undefined {
  return columns.find(
    (column) =>
      columnDndId(column.id) === dndId ||
      column.tasks.some((task) => taskDndId(task.id) === dndId),
  )
}

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
  const [columns, setColumns] = useState(board.columns)

  const [syncedColumns, setSyncedColumns] = useState(board.columns)
  if (board.columns !== syncedColumns) {
    setSyncedColumns(board.columns)
    setColumns(board.columns)
  }

  const [activeTask, setActiveTask] = useState<TaskItem | null>(null)

  const queryClient = useQueryClient()

  const moveMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: MoveTaskRequest }) => moveTask(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['board'] }),
    onError: () => setColumns(board.columns),
  })

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTask((active.data.current?.task as TaskItem | undefined) ?? null)
  }

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) {
      return
    }

    const activeRect = active.rect.current.translated
    const isBelowOver = !!activeRect && activeRect.top > over.rect.top + over.rect.height

    setColumns((prev) => moveToColumn(prev, String(active.id), String(over.id), isBelowOver))
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null)

    if (!over) {
      setColumns(board.columns)
      return
    }

    const activeId = String(active.id)
    const overId = String(over.id)
    let next = columns

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

    const finalColumn = findColumn(next, activeId)
    if (!finalColumn) {
      return
    }
    const position = finalColumn.tasks.findIndex((t) => taskDndId(t.id) === activeId)

    const originalColumn = findColumn(board.columns, activeId)
    const originalPosition = originalColumn?.tasks.findIndex((t) => taskDndId(t.id) === activeId)
    if (originalColumn?.id === finalColumn.id && originalPosition === position) {
      return
    }

    const taskId = (active.data.current?.task as TaskItem).id
    moveMutation.mutate({ id: taskId, data: { boardColumnId: finalColumn.id, position } })
  }

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

        <DragOverlay>{activeTask ? <TaskCard task={activeTask} /> : null}</DragOverlay>
      </DndContext>

      {moveMutation.isError && (
        <p className="text-sm text-red-600">{getErrorMessage(moveMutation.error)}</p>
      )}
    </>
  )
}

export default KanbanBoard