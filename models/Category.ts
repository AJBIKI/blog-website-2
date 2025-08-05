import mongoose, { Schema, Document, models } from 'mongoose';

// FIX: Added an optional 'description' field for better SEO and category pages.
interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
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
      // FIX: Added an index to the slug. This makes finding categories
      // by their slug much faster, which is useful for page lookups.
      index: true,
    },
    // FIX: Added the optional 'description' field to the schema.
    description: {
      type: String,
      required: false,
      trim: true,
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
CategorySchema.index({ name: 1, author: 1 }, { unique: true });
CategorySchema.index({ slug: 1, author: 1 }, { unique: true });

// FIX: Refined the export for consistency with the other models.
export default models.Category || mongoose.model<ICategory>('Category', CategorySchema);
