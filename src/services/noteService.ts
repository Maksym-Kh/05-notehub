import axios from "axios";
import type { note } from "../types/note";

interface noteResponse{
    notes: note[],
    totalPages: number,
}

interface noteParams{
    pageNumber?: number,
    query?: string,
}

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';    

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const fetchNotes = async ({pageNumber, query}: noteParams): Promise<noteResponse> => {

    const response = await axios.get<noteResponse>('/notes', {
        params: {
            page: pageNumber,
            search: query,
            perPage: 12,
        }
    });
    return response.data;
}

interface createNoteProps {
    title: string,
    content: string,
    tag: string,
};

export const createNote = async (noteInfo: createNoteProps): Promise<note> =>{
    const response = await axios.post<note>('/notes', noteInfo);
    return response.data;
    
}

export const deleteNote = async (id: string): Promise<void> => {
    const response = await axios.delete(`/notes/${id}`);
    return response.data;
}