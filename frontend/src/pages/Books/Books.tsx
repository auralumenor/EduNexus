import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { getBooks, createBook, updateBook, deleteBook, fetchOpenLibraryData } from '../../services/book.service';
import { Book } from '../../types';
import { Edit2, Trash2, Search, Loader2, RefreshCw, Eye, X, ExternalLink } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { Tooltip } from '../../components/common/Tooltip';
import { useAuth } from '../../context/AuthContext';

// Type for books fetched from OpenLibrary discovery
interface OpenLibraryBook {
  key: string;
  title: string;
  author: string;
  coverId: number | null;
  publishYear: number | null;
  publisher: string;
  isbn: string;
  subjects: string[];
  editionCount: number;
  description?: string;
}

// Trending subjects to cycle through for discovery
const DISCOVERY_SUBJECTS = [
  'science_fiction', 'artificial_intelligence', 'philosophy', 'mathematics',
  'history', 'psychology', 'programming', 'fantasy', 'mystery', 'economics',
  'physics', 'biology', 'literature', 'art', 'music', 'architecture',
];

const Books: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // ── Inventory State ──
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetchingId, setIsFetchingId] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState<Partial<Book>>({ title: '', author: '', isbn: '', totalCopies: 1, publisher: '', genre: '', description: '', coverImage: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<string | null>(null);

  // ── Discovery State ──
  const [discoveryBooks, setDiscoveryBooks] = useState<OpenLibraryBook[]>([]);
  const [discoveryLoading, setDiscoveryLoading] = useState(false);
  const [discoverySubjectIndex, setDiscoverySubjectIndex] = useState(0);
  const [previewBook, setPreviewBook] = useState<OpenLibraryBook | null>(null);
  const [previewInventoryBook, setPreviewInventoryBook] = useState<Book | null>(null);

  const { addToast } = useToast();

  useEffect(() => {
    fetchBooksInventory();
    fetchDiscoveryBooks(0);
  }, []);

  // ── Inventory Functions ──
  const fetchBooksInventory = async () => {
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
      fetchBooksInventory();
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
      fetchBooksInventory();
      addToast('Book removed from inventory.', 'success');
    } catch (err: any) {
      addToast(err?.response?.data?.message || 'Error deleting book', 'error');
      console.error('Error deleting book', err);
    } finally {
      setBookToDelete(null);
    }
  };

  // ── Discovery Functions ──
  const fetchDiscoveryBooks = useCallback(async (subjectIdx: number) => {
    setDiscoveryLoading(true);
    const subject = DISCOVERY_SUBJECTS[subjectIdx % DISCOVERY_SUBJECTS.length];
    try {
      const response = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=12`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();

      const mapped: OpenLibraryBook[] = (data.works || []).map((work: any) => ({
        key: work.key,
        title: work.title || 'Untitled',
        author: work.authors?.map((a: any) => a.name).join(', ') || 'Unknown Author',
        coverId: work.cover_id || null,
        publishYear: work.first_publish_year || null,
        publisher: work.publishers?.join(', ') || '',
        isbn: work.availability?.isbn || '',
        subjects: work.subject?.slice(0, 5) || [subject.replace(/_/g, ' ')],
        editionCount: work.edition_count || 0,
      }));

      setDiscoveryBooks(mapped);
    } catch (err) {
      console.error('Discovery fetch error:', err);
      addToast('Failed to fetch discovery books. Try refreshing.', 'error');
    } finally {
      setDiscoveryLoading(false);
    }
  }, [addToast]);

  const handleRefreshDiscovery = () => {
    const nextIdx = (discoverySubjectIndex + 1) % DISCOVERY_SUBJECTS.length;
    setDiscoverySubjectIndex(nextIdx);
    fetchDiscoveryBooks(nextIdx);
  };

  const handleAddDiscoveryToInventory = (book: OpenLibraryBook) => {
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn || '',
      totalCopies: 1,
      publisher: book.publisher || '',
      genre: book.subjects[0] || '',
      description: '',
      coverImage: book.coverId ? `https://covers.openlibrary.org/b/id/${book.coverId}-L.jpg` : '',
    });
    setEditingId(null);
    setIsAddModalOpen(true);
    setPreviewBook(null);
  };

  const currentSubject = DISCOVERY_SUBJECTS[discoverySubjectIndex % DISCOVERY_SUBJECTS.length].replace(/_/g, ' ');

  return (
    <div className="flex flex-col gap-6 animate-fade-in relative z-10 pb-20">

      {/* ═══════════════════════════════════════════ */}
      {/* SECTION 1: BOOKS CATALOG (INVENTORY)       */}
      {/* ═══════════════════════════════════════════ */}
      <div className="flex justify-between items-end mb-4 border-b border-outline-variant/10 pb-6">
        <div>
          <h1 className="text-3xl font-black font-headline text-on-surface dark:text-white tracking-tight">Books Catalog</h1>
          <p className="text-sm font-medium text-outline mt-1 hidden sm:block">Manage your unified library's inventory</p>
        </div>
        <div className="w-full sm:w-80 relative mt-4 sm:mt-0">
          <input
            type="text"
            placeholder="Search query..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-high dark:bg-slate-800 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-body text-on-surface dark:text-white placeholder:text-outline"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none" />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
           {[...Array(8)].map((_, i) => <div key={i} className="h-64 bg-surface-container-low rounded-2xl"></div>)}
        </div>
      ) : (() => {
        const filteredBooks = books.filter(b => 
          (b.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
          (b.author || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
          (b.isbn || '').toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredBooks.length === 0) {
          return (
             <div className="flex flex-col items-center justify-center py-20 bg-surface-container-low/50 dark:bg-slate-900/20 rounded-3xl border border-outline-variant/20 border-dashed">
                <span className="material-symbols-outlined text-6xl text-outline/30 mb-4">search_off</span>
                <p className="text-on-surface dark:text-white font-bold font-headline text-lg">No Volumes Targetted</p>
                <p className="text-sm text-outline mt-1">{searchTerm ? 'No books match your query constraint.' : 'The master archive tree is empty.'}</p>
             </div>
          );
        }

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(b => (
              <div key={b._id} className="bg-surface-container-low dark:bg-slate-900/40 rounded-2xl p-6 flex flex-col justify-between border border-transparent custom-shadow-hover transition-all duration-300 group cursor-pointer" onClick={() => setPreviewInventoryBook(b)}>
                 <div>
                    <div className="flex justify-between items-start mb-4">
                       <div className="w-12 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded border border-primary/10 flex items-center justify-center shadow-inner overflow-hidden relative">
                          {b.coverImage ? (
                             <img src={b.coverImage} alt={b.title} className="absolute inset-0 w-full h-full object-cover" />
                          ) : (
                             <span className="material-symbols-outlined text-primary/50 text-2xl">menu_book</span>
                          )}
                       </div>
                         <div className="flex bg-surface-container-highest dark:bg-slate-800 rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                           <Tooltip content="Preview" delay={200} position="top">
                             <button onClick={() => setPreviewInventoryBook(b)} className="p-1.5 text-outline hover:text-tertiary transition-colors rounded-md hover:bg-surface-container-lowest">
                                <Eye size={14} />
                             </button>
                           </Tooltip>
                           {isAdmin && (
                             <React.Fragment>
                               <Tooltip content="Edit" delay={200} position="top">
                                 <button onClick={() => { handleEdit(b); setIsAddModalOpen(true); }} className="p-1.5 text-outline hover:text-primary transition-colors rounded-md hover:bg-surface-container-lowest">
                                    <Edit2 size={14} />
                                 </button>
                               </Tooltip>
                               <Tooltip content="Delete" delay={200} position="top">
                                 <button onClick={() => setBookToDelete(b._id)} className="p-1.5 text-outline hover:text-error transition-colors rounded-md hover:bg-surface-container-lowest">
                                    <Trash2 size={14} />
                                 </button>
                               </Tooltip>
                             </React.Fragment>
                           )}
                         </div>
                    </div>
                    
                    <h3 className="text-lg font-black text-on-surface dark:text-white font-headline leading-tight line-clamp-2" title={b.title}>{b.title}</h3>
                    <p className="text-xs font-bold text-outline mt-1 line-clamp-1">{b.author}</p>
                    <div className="w-8 h-1 bg-outline-variant/30 rounded mt-4 mb-4"></div>
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">ISBN: {b.isbn}</p>
                 </div>
                 
                 <div className="mt-6 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       {b.availableCopies > 0 ? (
                         <>
                           <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                           <span className="text-[11px] font-black uppercase text-on-surface dark:text-white">{b.availableCopies} available</span>
                         </>
                       ) : (
                         <>
                           <div className="w-2 h-2 rounded-full bg-error shadow-[0_0_8px_rgba(186,26,26,0.5)]"></div>
                           <span className="text-[11px] font-black uppercase text-error">Out of Stock</span>
                         </>
                       )}
                    </div>
                    <span className="text-[10px] text-outline font-black bg-surface-container px-2 py-1 rounded">/ {b.totalCopies}</span>
                 </div>
              </div>
            ))}
          </div>
        );
      })()}

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION 2: OPEN LIBRARY DISCOVERY / PREVIEW    */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="mt-8">
        <div className="flex justify-between items-end mb-6 border-b border-outline-variant/10 pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black font-headline text-on-surface dark:text-white tracking-tight">Discover Books</h2>
              <span className="px-3 py-1 bg-tertiary/10 border border-tertiary/20 rounded-full text-[10px] font-black text-tertiary uppercase tracking-wider">OpenLibrary</span>
            </div>
            <p className="text-sm font-medium text-outline mt-1">
              Browsing <span className="text-primary font-bold capitalize">{currentSubject}</span> • Click any book to preview details
            </p>
          </div>
          <button
            onClick={handleRefreshDiscovery}
            disabled={discoveryLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-high dark:bg-slate-800 hover:bg-surface-container-highest dark:hover:bg-slate-700 rounded-lg transition-all active:scale-95 border border-outline-variant/10"
          >
            <RefreshCw size={16} className={`text-primary ${discoveryLoading ? 'animate-spin' : ''}`} />
            <span className="text-xs font-black text-on-surface dark:text-white uppercase tracking-wider hidden sm:inline">Refresh</span>
          </button>
        </div>

        {discoveryLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-[2/3] bg-surface-container-low rounded-xl"></div>
                <div className="h-3 bg-surface-container-low rounded w-3/4"></div>
                <div className="h-2 bg-surface-container-low rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {discoveryBooks.map((book) => (
              <div
                key={book.key}
                onClick={() => setPreviewBook(book)}
                className="group cursor-pointer flex flex-col"
              >
                <div className="aspect-[2/3] bg-surface-container-low dark:bg-slate-900/40 rounded-xl overflow-hidden relative border border-transparent hover:border-primary/20 transition-all duration-300 custom-shadow-hover">
                  {book.coverId ? (
                    <img
                      src={`https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-surface-container to-tertiary/10">
                      <span className="material-symbols-outlined text-4xl text-outline/30">auto_stories</span>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <div className="flex items-center gap-1.5 text-white">
                      <Eye size={14} />
                      <span className="text-[11px] font-bold uppercase tracking-wider">Preview</span>
                    </div>
                  </div>
                </div>
                <h4 className="text-sm font-black text-on-surface dark:text-white font-headline mt-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">{book.title}</h4>
                <p className="text-[11px] text-outline font-medium mt-0.5 line-clamp-1">{book.author}</p>
                {book.publishYear && (
                  <p className="text-[10px] text-outline/60 font-bold mt-1">{book.publishYear}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* FLOATING ACTION BUTTON                     */}
      {/* ═══════════════════════════════════════════ */}
      {isAdmin && (
        <button 
          onClick={() => { setEditingId(null); setForm({ title: '', author: '', isbn: '', totalCopies: 1, publisher: '', genre: '', description: '', coverImage: '' }); setIsAddModalOpen(true); }}
          className="fixed bottom-8 right-8 w-16 h-16 bg-primary hover:bg-primary-dim text-on-primary rounded-full shadow-[0_20px_50px_rgba(86,94,116,0.3)] flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-50 group"
        >
          <span className="material-symbols-outlined text-3xl transition-transform group-hover:rotate-90">add</span>
        </button>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* ADD / EDIT FORM MODAL                      */}
      {/* ═══════════════════════════════════════════ */}
      <Modal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); setEditingId(null); }} title={editingId ? 'Edit Volume' : 'Ingest New Volume'}>
        <form onSubmit={(e) => { handleSubmit(e); setIsAddModalOpen(false); }} className="flex flex-col gap-4 mt-2">
          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={handleFetchOpenLibrary}
              disabled={isFetchingId}
              className="w-full flex justify-center py-2.5 bg-primary/10 dark:bg-primary-fixed/10 border border-primary/20 hover:border-primary/40 rounded-lg transition-colors items-center gap-2"
            >
              {isFetchingId ? <Loader2 size={16} className="animate-spin text-primary" /> : <Search size={16} className="text-primary" />}
              <span className="text-primary dark:text-primary-fixed text-xs font-bold uppercase tracking-wider">Auto-fill Database</span>
            </button>
          </div>
          <Input label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <Input label="Author" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="ISBN" value={form.isbn || ''} onChange={e => setForm({ ...form, isbn: e.target.value })} />
            <Input label="Genre" value={form.genre || ''} onChange={e => setForm({ ...form, genre: e.target.value })} required />
          </div>
          <Input label="Total Copies" type="number" min="1" value={form.totalCopies} onChange={e => setForm({ ...form, totalCopies: parseInt(e.target.value) })} required />
          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/10 mt-2">
            <Button variant="secondary" type="button" onClick={() => { setIsAddModalOpen(false); setEditingId(null); }}>Cancel</Button>
            <Button variant="primary" type="submit">{editingId ? 'Save Changes' : 'Confirm Ingest'}</Button>
          </div>
        </form>
      </Modal>

      {/* ═══════════════════════════════════════════ */}
      {/* DELETE CONFIRMATION MODAL                  */}
      {/* ═══════════════════════════════════════════ */}
      <Modal isOpen={!!bookToDelete} onClose={() => setBookToDelete(null)} title="Destructive Action">
        <div className="flex flex-col gap-4 mt-2">
          <div className="p-4 bg-error/10 border border-error/20 rounded-xl flex gap-3 text-left">
            <span className="material-symbols-outlined text-error">warning</span>
            <div>
               <p className="text-sm font-bold text-error">Delete Volume?</p>
               <p className="text-[12px] font-medium text-error flex mt-1">
                 This permanently removes the book from the inventory subsystem and breaks existing transaction pointers related to it.
               </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <Button variant="secondary" onClick={() => setBookToDelete(null)}>Cancel</Button>
            <Button variant="primary" onClick={executeDelete} className="!bg-error hover:!bg-error/90 !text-white border-0">Force Delete</Button>
          </div>
        </div>
      </Modal>

      {/* ═══════════════════════════════════════════ */}
      {/* DISCOVERY BOOK PREVIEW MODAL               */}
      {/* ═══════════════════════════════════════════ */}
      {previewBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setPreviewBook(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"></div>
          <div
            className="relative bg-surface dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-fade-in flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cover Art */}
            <div className="md:w-2/5 flex-shrink-0 bg-gradient-to-br from-primary/10 via-surface-container to-tertiary/10 relative overflow-hidden">
              {previewBook.coverId ? (
                <img
                  src={`https://covers.openlibrary.org/b/id/${previewBook.coverId}-L.jpg`}
                  alt={previewBook.title}
                  className="w-full h-full object-cover min-h-[300px] md:min-h-full"
                />
              ) : (
                <div className="w-full h-full min-h-[300px] flex items-center justify-center">
                  <span className="material-symbols-outlined text-7xl text-outline/20">auto_stories</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/10"></div>
            </div>

            {/* Details */}
            <div className="md:w-3/5 p-8 flex flex-col overflow-y-auto">
              {/* Close */}
              <button onClick={() => setPreviewBook(null)} className="absolute top-4 right-4 p-2 bg-surface-container-high/80 backdrop-blur rounded-full hover:bg-surface-container-highest transition-colors z-10">
                <X size={18} className="text-on-surface dark:text-white" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-1 bg-tertiary/10 border border-tertiary/20 rounded text-[9px] font-black text-tertiary uppercase tracking-widest">OpenLibrary</span>
                {previewBook.editionCount > 0 && (
                  <span className="px-2.5 py-1 bg-primary/10 border border-primary/20 rounded text-[9px] font-black text-primary uppercase tracking-widest">{previewBook.editionCount} Editions</span>
                )}
              </div>

              <h2 className="text-2xl md:text-3xl font-black font-headline text-on-surface dark:text-white tracking-tight leading-tight">{previewBook.title}</h2>
              <p className="text-sm font-bold text-outline mt-2">{previewBook.author}</p>
              
              <div className="w-10 h-1 bg-primary/30 rounded mt-5 mb-5"></div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {previewBook.publishYear && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-outline font-black mb-1">Published</p>
                    <p className="text-sm font-bold text-on-surface dark:text-white">{previewBook.publishYear}</p>
                  </div>
                )}
                {previewBook.publisher && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-outline font-black mb-1">Publisher</p>
                    <p className="text-sm font-bold text-on-surface dark:text-white line-clamp-1">{previewBook.publisher}</p>
                  </div>
                )}
                {previewBook.isbn && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-outline font-black mb-1">ISBN</p>
                    <p className="text-sm font-mono font-bold text-on-surface dark:text-white">{previewBook.isbn}</p>
                  </div>
                )}
              </div>

              {/* Subjects */}
              {previewBook.subjects.length > 0 && (
                <div className="mb-6">
                  <p className="text-[10px] uppercase tracking-widest text-outline font-black mb-2">Subjects</p>
                  <div className="flex flex-wrap gap-1.5">
                    {previewBook.subjects.map((s, i) => (
                      <span key={i} className="px-2.5 py-1 bg-surface-container-high dark:bg-slate-800 rounded text-[11px] font-bold text-on-surface-variant capitalize">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-auto pt-6 border-t border-outline-variant/10 flex flex-col sm:flex-row gap-3">
                {isAdmin && (
                  <button
                    onClick={() => handleAddDiscoveryToInventory(previewBook)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-dim text-on-primary rounded-xl font-bold text-sm transition-all active:scale-[0.98] shadow-sm hover:shadow-md"
                  >
                    <span className="material-symbols-outlined text-lg">add_circle</span>
                    Add to Inventory
                  </button>
                )}
                <a
                  href={`https://openlibrary.org${previewBook.key}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex-1 flex items-center justify-center gap-2 py-3 bg-surface-container-high dark:bg-slate-800 hover:bg-surface-container-highest dark:hover:bg-slate-700 text-on-surface dark:text-white rounded-xl font-bold text-sm transition-all active:scale-[0.98] border border-outline-variant/10 ${!isAdmin ? 'w-full' : ''}`}
                >
                  <ExternalLink size={16} />
                  View on OpenLibrary
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* INVENTORY BOOK PREVIEW MODAL               */}
      {/* ═══════════════════════════════════════════ */}
      {previewInventoryBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setPreviewInventoryBook(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"></div>
          <div
            className="relative bg-surface dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-fade-in flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cover Art */}
            <div className="md:w-2/5 flex-shrink-0 bg-gradient-to-br from-primary/10 via-surface-container to-tertiary/10 relative overflow-hidden">
              {previewInventoryBook.coverImage ? (
                <img
                  src={previewInventoryBook.coverImage}
                  alt={previewInventoryBook.title}
                  className="w-full h-full object-cover min-h-[300px] md:min-h-full"
                />
              ) : (
                <div className="w-full h-full min-h-[300px] flex items-center justify-center">
                  <span className="material-symbols-outlined text-7xl text-outline/20">auto_stories</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="md:w-3/5 p-8 flex flex-col overflow-y-auto">
              <button onClick={() => setPreviewInventoryBook(null)} className="absolute top-4 right-4 p-2 bg-surface-container-high/80 backdrop-blur rounded-full hover:bg-surface-container-highest transition-colors z-10">
                <X size={18} className="text-on-surface dark:text-white" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-1 bg-primary/10 border border-primary/20 rounded text-[9px] font-black text-primary uppercase tracking-widest">Inventory</span>
                <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest ${previewInventoryBook.availableCopies > 0 ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-error/10 border border-error/20 text-error'}`}>
                  {previewInventoryBook.availableCopies > 0 ? `${previewInventoryBook.availableCopies} Available` : 'Out of Stock'}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-black font-headline text-on-surface dark:text-white tracking-tight leading-tight">{previewInventoryBook.title}</h2>
              <p className="text-sm font-bold text-outline mt-2">{previewInventoryBook.author}</p>

              <div className="w-10 h-1 bg-primary/30 rounded mt-5 mb-5"></div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-outline font-black mb-1">ISBN</p>
                  <p className="text-sm font-mono font-bold text-on-surface dark:text-white">{previewInventoryBook.isbn || '—'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-outline font-black mb-1">Genre</p>
                  <p className="text-sm font-bold text-on-surface dark:text-white capitalize">{previewInventoryBook.genre || '—'}</p>
                </div>
                {previewInventoryBook.publisher && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-outline font-black mb-1">Publisher</p>
                    <p className="text-sm font-bold text-on-surface dark:text-white">{previewInventoryBook.publisher}</p>
                  </div>
                )}
                {previewInventoryBook.publishedYear && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-outline font-black mb-1">Year</p>
                    <p className="text-sm font-bold text-on-surface dark:text-white">{previewInventoryBook.publishedYear}</p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-outline font-black mb-1">Total Copies</p>
                  <p className="text-sm font-bold text-on-surface dark:text-white">{previewInventoryBook.totalCopies}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-outline font-black mb-1">Available</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${previewInventoryBook.availableCopies > 0 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-error shadow-[0_0_8px_rgba(186,26,26,0.5)]'}`}></div>
                    <p className="text-sm font-bold text-on-surface dark:text-white">{previewInventoryBook.availableCopies}</p>
                  </div>
                </div>
              </div>

              {previewInventoryBook.description && (
                <div className="mb-6">
                  <p className="text-[10px] uppercase tracking-widest text-outline font-black mb-2">Description</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{previewInventoryBook.description}</p>
                </div>
              )}

              {isAdmin && (
                <div className="mt-auto pt-6 border-t border-outline-variant/10 flex gap-3">
                  <button
                    onClick={() => { handleEdit(previewInventoryBook); setIsAddModalOpen(true); setPreviewInventoryBook(null); }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-dim text-on-primary rounded-xl font-bold text-sm transition-all active:scale-[0.98] shadow-sm"
                  >
                    <Edit2 size={16} />
                    Edit Details
                  </button>
                  <button
                    onClick={() => { setBookToDelete(previewInventoryBook._id); setPreviewInventoryBook(null); }}
                    className="flex items-center justify-center gap-2 py-3 px-5 bg-error/10 hover:bg-error/20 text-error rounded-xl font-bold text-sm transition-all active:scale-[0.98] border border-error/20"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Books;
