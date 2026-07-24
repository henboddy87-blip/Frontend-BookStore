import { Trophy } from 'lucide-react';
import BookListPage from '../BookListPage';

export function BestsellersPage() {
  return (
    <BookListPage
      title="Bestsellers"
      subtitle="Our most popular books loved by thousands of readers"
      icon={Trophy}
      filterFn={b => b.rating >= 4.5}
      sortFn={(a, b) => b.rating - a.rating}
    />
  );
}
