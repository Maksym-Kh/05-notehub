import { useState } from "react";
import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import { useDebounce } from "use-debounce";

import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import EmptyMessage from "../EmptyMessage/EmptyMessage";
import { fetchNotes } from "../../services/noteService";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes({ pageNumber: page, query: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            page={page}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {isLoading && !data && <Loader />}
      {isError && <ErrorMessage />}
      {data && data.notes.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        !isLoading && <EmptyMessage />
      )}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onCancel={closeModal} />
        </Modal>
      )}
    </div>
  );
}
