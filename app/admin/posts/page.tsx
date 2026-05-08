


import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getCurrentUser';
import connectToDatabase from '@/lib/db';
import Post from '@/models/Post';
import { revalidatePath } from 'next/cache';

interface PostType {
  _id: string;
  title: string;
  status: 'draft' | 'published' | 'scheduled';
  category: {
    name: string;
    slug?: string;
  } | null;
  createdAt: string;
  slug: string;
}

async function getPosts(userId: string) {
  try {
    await connectToDatabase();
    const posts = await Post.find({ author: userId })
      .populate('category', 'name')
      .select('title status category createdAt slug _id')
      .sort({ createdAt: -1 })
      .lean();
    return {
      posts: JSON.parse(JSON.stringify(posts)),
      error: null,
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      posts: [],
      error: 'Could not load posts. Please try refreshing the page.',
    };
  }
}

export default async function PostsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { posts, error } = await getPosts(user.id);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create New Post
        </Link>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {!error && (
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <tr className="text-gray-500 dark:text-gray-400 uppercase text-xs font-semibold tracking-wider">
                  <th className="py-4 px-6 text-left">Title</th>
                  <th className="py-4 px-6 text-left">Status</th>
                  <th className="py-4 px-6 text-left">Category</th>
                  <th className="py-4 px-6 text-left">Date</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                {posts.length > 0 ? (
                  posts.map((post: PostType) => (
                    <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">{post.title}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          post.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          post.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            {post.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-center space-x-3">
                        <Link 
                          href={`/admin/posts/${post._id}/edit`} 
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
                              await Post.findOneAndDelete({ _id: post._id, author: user.id });
                              revalidatePath('/admin/posts');
                            } catch (error) {
                              console.error('Error deleting post:', error);
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
                    <td colSpan={5} className="py-8 px-6 text-center text-gray-500 italic">
                      No posts found. Start writing!
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