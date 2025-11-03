import { Note, NoteTag } from '@/types/note';
import axios from 'axios';

interface NoteListResponse {
  notes: Note[];
  totalPages: number;
}

axios.defaults.baseURL = `https://notehub-public.goit.study/api`;
const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

export const getNotes = async (
  page: number = 1,
  perPage: number = 12,
  search?: string
): Promise<NoteListResponse> => {
  const response = await axios.get<NoteListResponse>(`/notes`, {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
    },
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${myKey}`,
    },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axios.get<Note>(`/notes/${id}`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${myKey}`,
    },
  });
  return response.data;
};

export const createNote = async (title: string, content: string, tag: NoteTag): Promise<Note> => {
  const newNote = {
    title,
    content,
    tag,
  };

  const response = await axios.post<Note>(`/notes`, newNote, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${myKey}`,
    },
  });

  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`/notes/${id}`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${myKey}`,
    },
  });

  return response.data;
};
