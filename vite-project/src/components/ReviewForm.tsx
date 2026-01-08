import { useState } from 'react';
import { Button, Label, Textarea } from 'flowbite-react';
import { FaStar } from 'react-icons/fa';

export default function ReviewForm({ onSubmit, disabled }: { onSubmit: (data: { rating: number; comment: string }) => Promise<void>; disabled?: boolean }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({ rating, comment });
    setComment('');
    setRating(5);
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <Label>Puan</Label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} yıldız`}
              className="p-0"
            >
              <FaStar className={`${n <= rating ? 'text-yellow-400' : 'text-gray-300'} h-6 w-6`} />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="review-comment">Yorum</Label>
        <Textarea id="review-comment" placeholder="Yorumunuzu yazın" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" color="blue" size="md" className="min-w-[160px]" disabled={disabled}>Yorum Gönder</Button>
        {disabled && <span className="text-sm text-gray-600">Yorum eklemek için giriş yapın</span>}
      </div>
    </form>
  );
}
