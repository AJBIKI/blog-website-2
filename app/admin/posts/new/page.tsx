

import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getCurrentUser';
import connectToDatabase from '@/lib/db';
import Category from '@/models/Category';
import Tag from '@/models/Tag';
import PostForm from '@/components/forms/PostForm';
import { createPostAction } from '@/lib/actions';
import { PostFormCategory, PostFormTag } from '@/types/database';

async function getCategoriesAndTags(userId: string) {
  try {
    await connectToDatabase();
    const [categoriesResult, tagsResult] = await Promise.all([
      Category.find({ author: userId }).select('_id name').lean(),
      Tag.find({ author: userId }).select('_id name').lean(),
    ]);

    const categories = categoriesResult as unknown as PostFormCategory[];
    const tags = tagsResult as unknown as PostFormTag[];

    return {
      categories: JSON.parse(JSON.stringify(categories)),
      tags: JSON.parse(JSON.stringify(tags)),
      error: null,
    };
  } catch (error) {
    console.error('Error fetching categories or tags:', error);
    return {
      categories: [] as PostFormCategory[],
      tags: [] as PostFormTag[],
      error: 'Failed to fetch categories or tags. Please try refreshing the page.',
    };
  }
}

export default async function NewPostPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { categories, tags, error } = await getCategoriesAndTags(user.id);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <PostForm
          categories={categories}
          tags={tags}
          action={createPostAction}
          submitLabel="Create Post"
        />
      )}
    </div>
  );
}