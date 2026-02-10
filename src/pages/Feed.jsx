import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import AuthContext from '../context/AuthContext';

/**
 * Feed Component - Social feed for career advice and updates
 * 
 * Features:
 * - Display all user posts in reverse chronological order
 * - Create new posts (authenticated users)
 * - Shows user name and bio with each post
 * - Auto-refresh feed
 */
export default function Feed() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch all posts from the social feed
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/posts?limit=50');
      setPosts(res.data || []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  // Create a new post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Post content cannot be empty');
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setPosting(true);
      setError('');
      
      const res = await API.post('/posts', { content });
      
      if (res.status === 201) {
        setSuccess('Post created successfully!');
        setContent('');
        // Refresh feed
        await fetchPosts();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Failed to create post:', err);
      setError(err.response?.data?.error || 'Failed to create post');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Career Feed</h1>
        <p className="text-gray-600 text-lg">Share career advice, updates, and industry insights</p>
      </div>

      {/* Create Post Form (visible only to logged-in users) */}
      {user ? (
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 m-0 mb-4">Share an Update</h2>
          <form onSubmit={handleCreatePost}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, career updates, skills you're learning..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-base resize-vertical text-gray-700 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-300 focus:ring-opacity-10 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              rows="4"
              disabled={posting}
            />
            <div className="flex gap-3 mt-4">
              <button 
                type="submit" 
                className="btn disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={posting || !content.trim()}
              >
                {posting ? 'Posting...' : 'Post'}
              </button>
              {content && (
                <button 
                  type="button" 
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setContent('')}
                  disabled={posting}
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-amber-100 to-pink-100 rounded-lg p-8 mb-8 text-center border border-amber-300">
          <p className="text-amber-900 text-lg mb-4">Sign in to share your insights and connect with others</p>
          <button 
            className="btn"
            onClick={() => navigate('/login')}
          >
            Login to Post
          </button>
        </div>
      )}

      {/* Status Messages */}
      {error && <div className="error-box">{error}</div>}
      {success && <div className="success-box">{success}</div>}

      {/* Posts Feed */}
      <div className="mt-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-amber-500">
            Latest Posts ({posts.length})
          </h2>
          
          {loading ? (
            <div className="text-center py-12 text-gray-500 text-lg">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-gray-600 text-lg m-0">No posts yet. Be the first to share!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 transition-all hover:shadow-lg hover:border-amber-500">
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 m-0 mb-1">
                        {post.user_name || 'Anonymous'}
                      </h3>
                      <p className="text-sm text-gray-600 m-0">
                        {post.user_bio || 'No bio available'}
                      </p>
                    </div>
                    <span className="text-sm text-gray-400 ml-4 whitespace-nowrap">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="text-base text-gray-700 leading-relaxed">
                    <p className="m-0 whitespace-pre-wrap break-words">{post.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
