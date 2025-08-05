import mongoose, { Schema, Document, models } from 'mongoose';

interface ITag extends Document {
  name: string;
  slug: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      // FIX: Added an index to the slug. This makes finding posts
      // by their tag much faster, which is useful for filtering.
      index: true,
    },
    author: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for unique name per user
TagSchema.index({ name: 1, author: 1 }, { unique: true });
TagSchema.index({ slug: 1, author: 1 }, { unique: true });

// FIX: Refined the export for consistency with the other models.
export default models.Tag || mongoose.model<ITag>('Tag', TagSchema);
