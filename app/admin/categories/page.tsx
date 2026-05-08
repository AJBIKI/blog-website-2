
import { redirect } from 'next/navigation';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
import { getCurrentUser } from '@/lib/getCurrentUser';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import Post from '@/models/Post';

// Redefine based on ICategory from app/models/Category.ts
interface LeanCategoryType {
  _id: string;
  name?: string;
  slug?: string;
  description?: string;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
}

export default async function CategoriesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  await connectToDatabase();
  const categoriesData = await Category.find({ author: user.id }).select('name slug description createdAt updatedAt').lean();
  const categories: LeanCategoryType[] = JSON.parse(JSON.stringify(categoriesData));

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Manage Categories</h1>
      <Link
        href="/admin/categories/new"
        className="mb-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Add New Category
      </Link>
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <tr className="text-gray-500 dark:text-gray-400 uppercase text-xs font-semibold tracking-wider">
                <th className="py-4 px-6 text-left">Name</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 dark:text-gray-300 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">{category.name}</td>
                    <td className="py-4 px-6 text-center space-x-3">
                      <Link
                        href={`/admin/categories/${category._id}/edit`}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-600/30 hover:text-blue-800 dark:hover:text-blue-300 rounded-md text-sm font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      <form
                        action={async (formData: FormData) => {
                          'use server';
                          const user = await getCurrentUser();
                          if (!user) {
                            return;
                          }

                          try {
                            await connectToDatabase();
                            const deletedCategory = await Category.findOneAndDelete({ _id: category._id, author: user.id });

                            if (deletedCategory) {
                              // Update posts that reference this category to have null category
                              await Post.updateMany({ category: category._id }, { $set: { category: null } });
                            }

                            revalidatePath('/admin/categories');
                            revalidatePath('/admin/posts');
                            revalidatePath('/blog');
                          } catch (error) {
                            console.error('Error deleting category:', error);
                          }
                        }}
                        className="inline"
                      >
                        <button
                          type="submit"
                          className="inline-flex items-center px-3 py-1.5 bg-red-100 dark:bg-red-600/20 text-red-700 dark:text-red-500 hover:bg-red-200 dark:hover:bg-red-600/30 hover:text-red-800 dark:hover:text-red-400 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="py-8 px-6 text-center text-gray-500 italic">
                    No categories found. Start by creating one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}