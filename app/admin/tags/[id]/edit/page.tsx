import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/getCurrentUser';
import connectToDatabase from '@/lib/db';
import Tag from '@/models/Tag';
import TagForm from '@/components/forms/TagForm';
import { updateTagAction } from '@/lib/actions';
import { LeanTag } from '@/types/database';
import { isValidObjectId } from '@/lib/utils';

async function getTag(id: string, userId: string) {
  // Validate ObjectId format first
  if (!isValidObjectId(id)) {
    return { tag: null, error: 'Invalid tag ID format.' };
  }

  try {
    await connectToDatabase();
    const tagResult = await Tag.findOne({ _id: id, author: userId }).select('_id name').lean();
    if (!tagResult) {
      return { tag: null, error: 'Tag not found or unauthorized.' };
    }
    
    const tag = tagResult as unknown as LeanTag;
    return {
      tag: JSON.parse(JSON.stringify(tag)),
      error: null,
    };
  } catch (error) {
    console.error('Error fetching tag:', error);
    return { tag: null, error: 'Failed to fetch tag.' };
  }
}

// export default async function EditTagPage({ params }: { params: { id: string } })

export default async function EditTagPage({ params }: { params: Promise<{ id: string }> })

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

  const { tag, error } = await getTag(id, user.id);

  if (!tag || error) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Edit Tag</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <TagForm
          action={updateTagAction.bind(null, id)}
          submitLabel="Update Tag"
          initialValues={{ name: tag.name }}
        />
      )}
    </div>
  );
}