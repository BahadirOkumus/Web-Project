import { useEffect, useState } from 'react';
import http from '../api/http';
import type { Category } from '../types';
import { Checkbox, Label } from 'flowbite-react';

export default function CategoryMultiSelect({ value, onChange }: { value: number[]; onChange: (ids: number[]) => void }) {
  const [items, setItems] = useState<Category[]>([]);
  useEffect(() => {
    void (async () => {
      const res = await http.get('/categories');
      setItems(res.data);
    })();
  }, []);
  function toggle(id: number) {
    if (value.includes(id)) onChange(value.filter((x) => x !== id));
    else onChange([...value, id]);
  }
  return (
    <div className="grid gap-2">
      {items.map((c) => (
        <div key={c.id} className="flex items-center gap-2">
          <Checkbox checked={value.includes(c.id)} onChange={() => toggle(c.id)} id={`cat-${c.id}`} />
          <Label htmlFor={`cat-${c.id}`}>{c.name}</Label>
        </div>
      ))}
    </div>
  );
}
