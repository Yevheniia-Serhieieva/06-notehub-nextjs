'use client';

import { getNotes } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import Loading from '@/app/loading';
import Error from './[id]/error';
import NoteList from '@/components/NoteList/NoteList';
import css from './Notes.client.module.css';
import { useState } from 'react';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';

const NotesClient = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', currentPage, search],
    queryFn: () => getNotes(currentPage, 12, search),
    refetchOnMount: false,
  });

  const notes = data?.notes;

  if (isLoading) return <Loading />;
  if (isError || !notes) return <Error />;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox value={search} onSearchChange={handleSearch} />

          {data && data.totalPages > 1 && (
            <Pagination
              pageCount={data.totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}

          {
            <button onClick={openModal} className={css.button}>
              Create note +
            </button>
          }
        </header>

        {!isLoading && !isError && data?.notes?.length === 0 ? (
          <p>No notes found.</p>
        ) : (
          <NoteList notes={data?.notes || []} />
        )}

        {isModalOpen && (
          <Modal onClose={closeModal}>
            <NoteForm onCancel={closeModal} />
          </Modal>
        )}
      </div>
    </>
  );
};

export default NotesClient;
