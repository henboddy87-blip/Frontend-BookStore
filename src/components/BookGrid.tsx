import { Book } from '../types';
import { BookCard } from './BookCard';

interface BookGridProps {
  books: Book[];
  onBookClick: (book: Book) => void;
}

export function BookGrid({ books, onBookClick }: BookGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {books.map(book => (
        <BookCard key={book.id} book={book} onBookClick={onBookClick} />
      ))}
    </div>
  );
}
