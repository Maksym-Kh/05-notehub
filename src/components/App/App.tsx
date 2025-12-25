import { useState } from 'react'
import css from './App.module.css'
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../NoteModal/NoteModal';
import NoteForm from '../NoteForm/NoteForm';
import SearchBox from '../SearchBox/SearchBox'
import { useDebounce } from 'use-debounce';


export default function App() {

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 300);
    const [totalPages, setTotalPages] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    }

    return (
        <div className={css.app}>
            <header className={css.toolbar}>
                <SearchBox value={search} onChange={handleSearchChange} />
                {totalPages > 1 && (<Pagination totalPages={totalPages} page={page} onPageChange={setPage} />)}
                <button className={css.button} onClick={openModal}>Create note +</button>
            </header >
            {isModalOpen && (
                <Modal onClose={closeModal}>
                    <NoteForm onCancel={closeModal} />
                </Modal>)}
            <NoteList pageNumber={page} query={debouncedSearch} onDataLoaded={setTotalPages} />
        </div >
    )
}