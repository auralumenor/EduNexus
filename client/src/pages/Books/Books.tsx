import React, { useEffect, useState } from 'react';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { getBooks, createBook, updateBook, deleteBook, fetchOpenLibraryData } from '../../services/book.service';
import { Book } from '../../types';
import { Plus, Edit2, Trash2, BookOpen, Search, Loader2 } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { Tooltip } from '../../components/common/Tooltip';

const Books: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingId, setIsFetchingId] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState<Partial<Book>>({ title: '', author: '', isbn: '', totalCopies: 1, publisher: '', genre: '', description: '', coverImage: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { addToast } = useToast();
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateBook(editingId, form);
      } else {
        await createBook(form);
      }
      setForm({ title: '', author: '', isbn: '', totalCopies: 1, publisher: '', genre: '', description: '', coverImage: '' });
      setEditingId(null);
      fetchBooks();
      addToast(editingId ? 'Book updated successfully!' : 'Book added successfully!', 'success');
    } catch (err: any) {
      addToast(err?.response?.data?.message || 'Error saving book details.', 'error');
      console.error('Error saving book', err);
    }
  };

  const handleFetchOpenLibrary = async () => {
    const title = form.title?.trim();
    const author = form.author?.trim();
    const isbn = form.isbn?.trim();

    if (!title && !author && !isbn) {
      addToast('Please enter a Title, Author, or ISBN first to auto-fetch.', 'error');
      return;
    }
    
    setIsFetchingId(true);
    try {
      const data = await fetchOpenLibraryData({ title, author, isbn });
      
      setForm((prev) => ({
        ...prev,
        title: data.title || prev.title,
        author: data.author || prev.author,
        publisher: data.publisher || prev.publisher,
        publishedYear: data.publishedYear || prev.publishedYear,
        genre: data.genre || prev.genre,
        isbn: data.isbn || prev.isbn,
        coverImage: data.coverImage || prev.coverImage,
      }));
      addToast('Book details auto-filled successfully!', 'success');
    } catch (err) {
      addToast('Failed to fetch book data. Please check your query or try manually.', 'error');
    } finally {
      setIsFetchingId(false);
    }
  };

  const handleEdit = (b: Book) => {
    setForm({ 
      title: b.title, 
      author: b.author, 
      isbn: b.isbn, 
      totalCopies: b.totalCopies,
      publisher: b.publisher,
      publishedYear: b.publishedYear,
      genre: b.genre,
      description: b.description,
      coverImage: b.coverImage
    });
    setEditingId(b._id);
  };

  const executeDelete = async () => {
    if (!bookToDelete) return;
    try {
      await deleteBook(bookToDelete);
      fetchBooks();
      addToast('Book removed from inventory.', 'success');
    } catch (err: any) {
      addToast(err?.response?.data?.message || 'Error deleting book', 'error');
      console.error('Error deleting book', err);
    } finally {
      setBookToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 text-text-primary-light dark:text-text-primary-dark">Books Catalog</h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark hidden sm:block">Manage your library's inventory</p>
        </div>
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            placeholder="Search title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2 bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark"
          />
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Container */}
        <div className="lg:col-span-1">
          <GlassCard className="sticky top-6">
            <h2 className="text-lg font-bold mb-4 text-text-primary-light dark:text-text-primary-dark">
              {editingId ? 'Edit Book' : 'Add New Book'}
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleFetchOpenLibrary}
                  disabled={isFetchingId}
                  className="w-full flex justify-center py-2 bg-gradient-to-r from-indigo-500/10 to-primary/10 border border-primary/20 hover:border-primary/50 transition-colors"
                >
                  {isFetchingId ? <Loader2 size={18} className="animate-spin text-primary mr-2" /> : <Search size={18} className="text-primary mr-2" />}
                  <span className="text-primary text-sm font-medium">Auto-fill with Title, Author, or ISBN</span>
                </Button>
              </div>
              <Input
                label="Title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
              />
              <Input
                label="Author"
                value={form.author}
                onChange={e => setForm({ ...form, author: e.target.value })}
                required
              />
              {/* Hidden ISBN Field - Reserved for future mandatory requirement */}
              <div className="hidden">
                <Input
                  label="ISBN"
                  value={form.isbn || ''}
                  onChange={e => setForm({ ...form, isbn: e.target.value })}
                  required={false}
                />
              </div>
              <Input
                label="Genre"
                value={form.genre || ''}
                onChange={e => setForm({ ...form, genre: e.target.value })}
                required
              />
              <Input
                label="Total Copies"
                type="number"
                min="1"
                value={form.totalCopies}
                onChange={e => setForm({ ...form, totalCopies: parseInt(e.target.value) })}
                required
              />
              <div className="flex gap-2 pt-2">
                <Button type="submit" variant="primary" className="flex-1">
                  {editingId ? 'Update' : 'Add'}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setEditingId(null);
                      setForm({ title: '', author: '', isbn: '', totalCopies: 1, publisher: '', genre: '', description: '', coverImage: '' });
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </GlassCard>
        </div>

        {/* List Container */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {loading ? (
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Loading books...</p>
          ) : (() => {
            const filteredBooks = books.filter(b => 
              (b.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
              (b.author || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
              (b.isbn || '').toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (filteredBooks.length === 0) {
              return (
                <GlassCard className="text-center py-12">
                  <BookOpen size={48} className="mx-auto text-border-light dark:text-border-dark mb-4" />
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">
                    {searchTerm ? 'No books match your search.' : 'No books found in the catalog.'}
                  </p>
                </GlassCard>
              );
            }

            return filteredBooks.map(b => (
              <GlassCard key={b._id} className="!p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary/30 transition-colors">
                <div className="flex flex-col min-w-0">
                  <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark truncate">{b.title}</h3>
                  <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1 flex flex-wrap items-center gap-2">
                    <span>{b.author}</span>
                    <span className="w-1 h-1 rounded-full bg-border-light dark:bg-border-dark" />
                    <span className="font-mono text-xs">{b.isbn}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm font-medium">
                    {b.availableCopies > 0 ? (
                      <span className="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-0.5 rounded">
                        {b.availableCopies} / {b.totalCopies} Available
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <Tooltip content="Edit Book Information" delay={4000} position="top">
                    <Button variant="secondary" onClick={() => handleEdit(b)} className="flex-1 sm:flex-none !px-3">
                      <Edit2 size={16} /> <span className="sm:hidden ml-1">Edit</span>
                    </Button>
                  </Tooltip>
                  <Tooltip content="Delete Book Permanently" delay={4000} position="top">
                    <Button variant="secondary" onClick={() => setBookToDelete(b._id)} className="flex-1 sm:flex-none !px-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">
                      <Trash2 size={16} /> <span className="sm:hidden ml-1">Delete</span>
                    </Button>
                  </Tooltip>
                </div>
              </GlassCard>
            ));
          })()}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!bookToDelete} onClose={() => setBookToDelete(null)} title="Delete Book">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Are you sure you want to delete this book? This will permanently remove it from the inventory. Wait, this may also break existing transactions tied to it!
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" onClick={() => setBookToDelete(null)}>Cancel</Button>
            <Button variant="primary" onClick={executeDelete} className="!bg-red-500 hover:!bg-red-600 focus:!ring-red-500/20">
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Books;
