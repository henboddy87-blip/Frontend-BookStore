import { Tag } from 'lucide-react';
import BookListPage from '../BookListPage';

export function OnSalePage() {
  return (
    <BookListPage
      title="On Sale"
      subtitle="Great books at even greater prices — limited time only"
      icon={Tag}
      filterFn={b => b.originalPrice !== undefined && b.originalPrice > b.price}
    />
  );
}
