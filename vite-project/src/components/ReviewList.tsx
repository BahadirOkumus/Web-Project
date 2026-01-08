import type { Review } from '../types';

export default function ReviewList({ reviews, canDelete, onDelete }: {
  reviews: Review[];
  canDelete: boolean;
  onDelete: (id: number) => Promise<void>;
}) {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {reviews.map((r) => (
        <div key={r.id} style={{ border: '1px solid #ddd', padding: 8 }}>
          <div>Puan: {r.rating}</div>
          <div>{r.comment}</div>
          <div>{r.user?.name}</div>
          {canDelete && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button onClick={() => onDelete(r.id)}>Sil</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
