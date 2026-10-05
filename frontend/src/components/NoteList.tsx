import type { Note } from "../types";

export default function NoteList({ notes }: { notes: Note[] }) {
  if (notes.length === 0) {
    return <p className="state-message">No notes yet. Add the first one below.</p>;
  }

  return (
    <div>
      {notes.map((note) => (
        <div key={note.id} className="note-item">
          <div>{note.content}</div>
          <time>{new Date(note.createdAt).toLocaleString()}</time>
        </div>
      ))}
    </div>
  );
}
