


import connectToDatabase from '@/lib/db';
import Post from '@/models/Post';

interface PostType {
  _id: string;
  title: string;
  content: string;
  coverImage: string | null;
  slug: string;
  createdAt: string;
}

async function getPosts() {
  try {
    await connectToDatabase();
    const posts = await Post.find({ status: 'published' })
      .select('title content coverImage slug createdAt')
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
      error: 'Failed to load posts. Please try refreshing the page.',
    };
  }
}

export default async function BlogPage() {
  const { posts, error } = await getPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-slate-800 dark:via-slate-900 dark:to-black text-white transition-colors duration-300">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Our Blog
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              Discover insights, stories, and ideas that matter
            </p>
            <div className="w-24 h-1 bg-white mx-auto rounded-full opacity-80"></div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-16">
        {error ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center transition-colors">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {posts.length > 0 ? (
              <>
                {/* Stats Bar */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-12 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{posts.length}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Articles</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">∞</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Ideas</div>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center text-gray-400">
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="text-sm">Knowledge Base</span>
                    </div>
                  </div>
                </div>

                {/* Posts Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post: PostType, index: number) => (
                    <article 
                      key={post._id} 
                      className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl dark:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500 ${
                        index === 0 ? 'md:col-span-2 lg:col-span-3' : ''
                      }`}
                    >
                      {/* Featured Post Layout */}
                      {index === 0 ? (
                        <div className="md:flex">
                          {post.coverImage && (
                            <div className="md:w-1/2">
                              <div className="relative h-64 md:h-full overflow-hidden">
                                <img
                                  src={post.coverImage}
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-4 left-4">
                                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                    Featured
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className={`p-8 ${post.coverImage ? 'md:w-1/2' : 'w-full'} flex flex-col justify-center`}>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                              {post.title}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 text-lg">
                              {post.content.slice(0, 300)}...
                            </p>
                            <a 
                              href={`/blog/${post.slug}`}
                              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold group/link transition-colors"
                            >
                              Read Full Article
                              <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      ) : (
                        /* Regular Post Layout */
                        <>
                          {post.coverImage && (
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                          )}
                          <div className="p-6">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(post.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 line-clamp-3">
                              {post.content.slice(0, 150)}...
                            </p>
                            <a 
                              href={`/blog/${post.slug}`}
                              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium group/link transition-colors"
                            >
                              Read More
                              <svg className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </a>
                          </div>
                        </>
                      )}
                    </article>
                  ))}
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                    <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No Posts Yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    We're working on creating amazing content for you. Check back soon for our latest articles and insights!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}