import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import css from './NoteList.module.css'
import { fetchNotes, deleteNote } from '../../services/noteService'
import { useEffect } from 'react';

import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import EmptyMessage from '../EmptyMessage/EmptyMessage';

interface Props{
    pageNumber: number;
    query: string;
    onDataLoaded: (totalPages: number) => void;
}

export default function NoteList({ pageNumber, query, onDataLoaded }: Props) {
    
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['notes', pageNumber, query],
        queryFn: () => fetchNotes({ pageNumber, query }),
    })
    
    const { mutate: mutateDelete } = useMutation({
        mutationKey: ["deleteNote"],
        mutationFn: deleteNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
        onError: (error) => {
            alert("Error deleting note: " + error.message);
        }
    });

    useEffect(() => {
        if (data?.totalPages) {
            onDataLoaded(data.totalPages);
        }
    }, [data?.totalPages, onDataLoaded]);
    
    if (isLoading) {
        return <Loader />;
    }

    if (isError) {
        return <ErrorMessage />;
    }

    if (!data || data.notes.length === 0) {
        return <EmptyMessage />;
    }

    return (

        <ul className={css.list}>
            {data?.notes.map((note) => (
                <li key={note.id} className={css.listItem}>
                    <h2 className={css.title}>{note.title}</h2>
                    <p className={css.content}>{note.content}</p>
                    <div className={css.footer}>
                        <span className={css.tag}>{note.tag}</span>
                        <button className={css.button} onClick={() => mutateDelete(note.id)}>Delete</button>
                    </div>
                </li>
            ))}
        </ul>

    )
}