
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/getCurrentUser';
import connectToDatabase from '@/lib/db';
import Post from '@/models/Post';
import Category from '@/models/Category';
import Tag from '@/models/Tag';
import PostForm from '@/components/forms/PostForm';
import { updatePostAction } from '@/lib/actions';

interface PostType {
  _id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'scheduled';
  coverImage: string | null;
  publishedAt: string | null;
  slug: string;
}

interface CategoryType {
  _id: string;
  name: string;
}

interface TagType {
  _id: string;
  name: string;
}

async function getPostAndCategories(id: string, userId: string) {
  try {
    await connectToDatabase();
    // Fetch post, categories, and tags
    const [post, categories, tags] = await Promise.all([
      Post.findOne({ _id: id, author: userId })
        .populate('category', 'name slug')
        .populate('tags', 'name slug')
        .lean(),
      Category.find({ author: userId }).select('_id name').lean(),
      Tag.find({ author: userId }).select('_id name').lean(),
    ]);
    if (!post) {
      return { post: null, categories: [], tags: [], error: 'Post not found.' };
    }
    return {
      post: JSON.parse(JSON.stringify(post)),
      categories: JSON.parse(JSON.stringify(categories)),
      tags: JSON.parse(JSON.stringify(tags)),
      error: null,
    };
  } catch (error) {
    console.error('Error fetching post or categories:', error);
    return { post: null, categories: [], tags: [], error: 'Failed to fetch post or categories.' };
  }
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { id } = await params;
  const { post, categories, tags, error } = await getPostAndCategories(id, user.id);

  if (!post || error) {
    redirect('/admin/posts');
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <PostForm
          action={updatePostAction.bind(null, id)}
          submitLabel="Update Post"
          categories={categories}
          tags={tags}
          defaultValues={{
            _id: post._id,
            title: post.title,
            content: post.content,
            category: post.category,
            tags: post.tags || [],
            status: post.status,
            coverImage: post.coverImage || '',
            publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : '',
          }}
        />
      )}
    </div>
  );
}