// import mongoose from 'mongoose';
// import 'dotenv/config'; // 🟢 Force-load .env before anything else
// const MONGODB_URI = process.env.MONGODB_URI;
// console.log('MONGODB_URI:', MONGODB_URI);

// if (!MONGODB_URI) {
//   throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
// }

// // Augment the global object to cache the connection
// interface MongooseGlobal {
//   mongoose: {
//     conn: typeof mongoose | null;
//     promise: Promise<typeof mongoose> | null;
//   };
// }

// // Use `globalThis` instead of `global` to satisfy TypeScript
// const globalWithMongoose = globalThis as unknown as MongooseGlobal;

// let cached = globalWithMongoose.mongoose;

// if (!cached) {
//   cached = globalWithMongoose.mongoose = { conn: null, promise: null };
// }

// async function connectToDatabase() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     };

//     cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => mongooseInstance);
//   }

//   try {
//     cached.conn = await cached.promise;
//   } catch (e) {
//     cached.promise = null;
//     throw e;
//   }

//   return cached.conn;
// }

// export default connectToDatabase;




// import mongoose, { Schema } from 'mongoose';

// import 'dotenv/config'; // 🟢 Force-load .env before anything else
// const MONGODB_URI = process.env.MONGODB_URI;
// console.log('MONGODB_URI:', MONGODB_URI);

// if (!MONGODB_URI) {
//   throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
// }

// // Augment the global object to cache the connection
// interface MongooseGlobal {
//   mongoose: {
//     conn: typeof mongoose | null;
//     promise: Promise<typeof mongoose> | null;
//   };
// }

// // Use `globalThis` instead of `global` to satisfy TypeScript
// const globalWithMongoose = globalThis as unknown as MongooseGlobal;

// let cached = globalWithMongoose.mongoose;

// if (!cached) {
//   cached = globalWithMongoose.mongoose = { conn: null, promise: null };
// }

// // Import schemas
// import CategorySchema from '@/models/Category';
// import TagSchema from '@/models/Tag'; // Update with actual file
// import PostSchema from '@/models/Post'; // Update with actual file

// // Define interfaces (move these to a types file if reused elsewhere)
// interface ICategory extends mongoose.Document {
//   name: string;
//   slug: string;
//   description?: string;
//   author: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// interface ITag extends mongoose.Document {
//   name: string;
//   slug: string;
//   author: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// interface IPost extends mongoose.Document {
//   title: string;
//   content: string;
//   slug: string;
//   status: string;
//   coverImage?: string;
//   publishedAt?: Date;
//   createdAt: Date;
//   updatedAt: Date;
//   author: string;
//   category: mongoose.Types.ObjectId;
//   tags: mongoose.Types.ObjectId[];
// }

// // Register Models with explicit generics
// export const Category = (mongoose.models.Category as mongoose.Model<ICategory>) || mongoose.model<ICategory>('Category', CategorySchema);
// export const Tag = (mongoose.models.Tag as mongoose.Model<ITag>) || mongoose.model<ITag>('Tag', TagSchema);
// export const Post = (mongoose.models.Post as mongoose.Model<IPost>) || mongoose.model<IPost>('Post', PostSchema);

// async function connectToDatabase() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     };

//     cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => mongooseInstance);
//   }

//   try {
//     cached.conn = await cached.promise;
//   } catch (e) {
//     cached.promise = null;
//     throw e;
//   }

//   return cached.conn;
// }

// export default connectToDatabase;

import mongoose, { Schema } from 'mongoose';
import 'dotenv/config'; // 🟢 Force-load .env before anything else

const MONGODB_URI = process.env.MONGODB_URI;
console.log('MONGODB_URI:', MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Augment the global object to cache the connection
interface MongooseGlobal {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Use `globalThis` instead of `global` to satisfy TypeScript
const globalWithMongoose = globalThis as unknown as MongooseGlobal;

let cached = globalWithMongoose.mongoose;

if (!cached) {
  cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

// Import schemas (ensure your model files export schemas, not registered models)
import CategorySchema from '@/models/Category';
import TagSchema from '@/models/Tag';
import PostSchema from '@/models/Post';

// Define interfaces (move these to a types file if reused elsewhere)
interface ICategory extends mongoose.Document {
  name: string;
  slug: string;
  description?: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ITag extends mongoose.Document {
  name: string;
  slug: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IPost extends mongoose.Document {
  title: string;
  content: string;
  slug: string;
  status: 'draft' | 'published' | 'scheduled';
  coverImage?: string | null;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  author: mongoose.Types.ObjectId;
  category: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
}

// Register Models with explicit generics and proper type casting
export const Category = (mongoose.models.Category as mongoose.Model<ICategory>) || 
  mongoose.model<ICategory>('Category', CategorySchema as unknown as Schema<ICategory>);

export const Tag = (mongoose.models.Tag as mongoose.Model<ITag>) || 
  mongoose.model<ITag>('Tag', TagSchema as unknown as Schema<ITag>);

export const Post = (mongoose.models.Post as mongoose.Model<IPost>) || 
  mongoose.model<IPost>('Post', PostSchema as unknown as Schema<IPost>);

async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongooseInstance) => mongooseInstance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;