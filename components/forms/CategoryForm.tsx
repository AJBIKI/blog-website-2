

'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface CategoryFormProps {
  action: (formData: FormData) => Promise<{ success: boolean; message: string; categoryId?: string; redirect?: string }>;
  submitLabel: string;
  initialValues?: { name: string }; // Add initialValues
}

export default function CategoryForm({ action, submitLabel, initialValues }: CategoryFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await action(formData);
      if (result.success) {
        router.push(result.redirect || '/admin/categories'); // Use redirect if provided
      } else {
        setError(result.message);
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Category Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          defaultValue={initialValues?.name ?? ''} // Use initialValues for pre-filling
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          disabled={isPending}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        {isPending ? 'Submitting...' : submitLabel} // Update for consistency
      </button>
    </form>
  );
}