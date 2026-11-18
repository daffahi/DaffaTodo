// Folder utils berisi fungsi kecil yang dipakai di banyak tempat.
// Id di dnd-kit harus unik di seluruh papan. Id tugas dan id kolom sama-sama angka,
// jadi bisa bentrok (kolom 4 dan tugas 4). Solusinya diberi awalan.
// Awalan "task-" dan "column-" supaya id tugas dan id kolom tidak pernah sama
export const taskDndId = (id: number) => `task-${id}`
export const columnDndId = (id: number) => `column-${id}`