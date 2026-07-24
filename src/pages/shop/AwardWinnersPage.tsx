import { Medal } from 'lucide-react';
import BookListPage from '../BookListPage';

export function AwardWinnersPage() {
  return (
    <BookListPage
      title="Award Winners"
      subtitle="Critically acclaimed titles that have won prestigious literary awards"
      icon={Medal}
      filterFn={b => b.tags?.some(t => ['award', 'pulitzer', 'booker', 'nobel', 'bestseller'].includes(t.toLowerCase()))}
      sortFn={(a, b) => b.rating - a.rating}
    />
  );
}
