import { Button } from 'flowbite-react'

export default function Modal({ open, title, children, onClose }: { open: boolean; title?: string; children: React.ReactNode; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
        <div className="space-y-4">{children}</div>
        <div className="mt-6 text-right">
          <Button color="gray" onClick={onClose}>Kapat</Button>
        </div>
      </div>
    </div>
  );
}
