// Satu kolom: nama kolom, jumlah tugas, daftar kartu tugas, dan form tambah tugas.

import type { Column } from '../types/column'
import AddTaskForm from './AddTaskForm'
import TaskCard from './TaskCard'

interface KanbanColumnProps {
  column: Column
}

function KanbanColumn({ column }: KanbanColumnProps) {
  return (
    // w-72 = lebar tetap, shrink-0 = lebar tidak menyusut walau kolomnya banyak
    <div className="w-72 shrink-0 rounded-lg bg-slate-200 p-3">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold text-slate-800">{column.name}</h2>
        <span className="text-sm text-slate-500">{column.tasks.length}</span>
      </div>

      <div className="space-y-2">
        {column.tasks.length === 0 && (
          <p className="px-1 text-sm text-slate-500">No tasks yet.</p>
        )}

        {/* Urutan tugas sudah diurutkan oleh backend berdasarkan Position */}
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        <AddTaskForm columnId={column.id} />
      </div>
    </div>
  )
}

export default KanbanColumn