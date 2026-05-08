import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/getCurrentUser';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
import CategoryForm from '@/components/forms/CategoryForm';
import { updateCategoryAction } from '@/lib/actions';
import { LeanCategory } from '@/types/database';
import { isValidObjectId } from '@/lib/utils';

async function getCategory(id: string, userId: string) {
  // Validate ObjectId format first
  if (!isValidObjectId(id)) {
    return { category: null, error: 'Invalid category ID format.' };
  }

  try {
    await connectToDatabase();
    const categoryResult = await Category.findOne({ _id: id, author: userId })
      .select('_id name')
      .lean();

    if (!categoryResult) {
      return { category: null, error: 'Category not found or unauthorized.' };
    }
    
    const category = categoryResult as unknown as LeanCategory;
    return {
      category: JSON.parse(JSON.stringify(category)),
      error: null,
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return { category: null, error: 'Failed to fetch category.' };
  }
}

// export default async function EditCategoryPage({ params }: { params: { id: string } })

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> })

{
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { id } = await params;
  
  // Early validation - if ID is invalid, show 404
  if (!isValidObjectId(id)) {
    notFound();
  }

  const { category, error } = await getCategory(id, user.id);

  if (!category || error) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Edit Category</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <CategoryForm
          action={updateCategoryAction.bind(null, id)}
          submitLabel="Update Category"
          initialValues={{ name: category.name }}
        />
      )}
    </div>
  );
}