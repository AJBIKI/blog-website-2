

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getCurrentUser';
import connectToDatabase from '@/lib/db';
import Tag from '@/models/Tag';
import { deleteTagAction } from '@/lib/actions';

// Redefine based on assumed Tag schema and lean() output
interface LeanTagType {
  _id: string;
  name?: string;
  slug?: string;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
}

async function getTags(userId: string) {
  try {
    await connectToDatabase();
    const tags: LeanTagType[] = await Tag.find({ author: userId }).select('name slug _id createdAt updatedAt').lean() as LeanTagType[];
    return {
      tags: JSON.parse(JSON.stringify(tags)),
      error: null,
    };
  } catch (error) {
    console.error('Error fetching tags:', error);
    return {
      tags: [],
      error: 'Failed to load tags. Please try refreshing the page.',
    };
  }
}

export default async function TagsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { tags, error } = await getTags(user.id);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tags</h1>
        <Link
          href="/admin/tags/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create New Tag
        </Link>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {!error && (
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
                {tags.length > 0 ? (
                  tags.map((tag: LeanTagType) => (
                    <tr key={tag._id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">{tag.name}</td>
                      <td className="py-4 px-6 text-center space-x-3">
                        <Link
                          href={`/admin/tags/${tag._id}/edit`}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-100 dark:bg-blue-600/20 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-600/30 hover:text-blue-800 dark:hover:text-blue-300 rounded-md text-sm font-medium transition-colors"
                        >
                          Edit
                        </Link>
                        <form
                          action={deleteTagAction}
                          className="inline"
                        >
                          <input type="hidden" name="tagId" value={tag._id} />
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
                      No tags found. Start by creating one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}