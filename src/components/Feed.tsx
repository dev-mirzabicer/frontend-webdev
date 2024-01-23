import React, { useState, useEffect, useRef, useCallback } from 'react';
import PostService from '../services/PostService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as boldBook } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as regularBook } from '@fortawesome/free-regular-svg-icons';
import "./Feed.css";

export const PostItem = ({ post, onClick, children }: any) => {
    return (
      <div className="card post-item-card" onClick={onClick} style={{ cursor: 'pointer' }}>
        {post?.image && <img src={post.image} className="card-img-top" alt={post.title} />}
        <div className="card-body">
          <h5 className="card-title">{post.title}</h5>
          <p className="card-text">{post.description}</p>
          <p className="card-text" style={{position: "relative"}}>
            {children}
          </p>
        </div>
      </div>
    );
  };
  
const Feed = () => {
  const [posts, setPosts] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user, getUser } = useAuth();
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();
  const [error, setError] = useState('');

  useEffect(() => {
    if(isAuthenticated && !user) getUser();
    loadInitialFeed();
    if (!isAuthenticated) {
      return;
    }
    return () => {
        try {
            if(isAuthenticated)
            (async () => {await PostService.deleteFeed();})().catch(error => console.error(error));
        } catch (error) {
            console.error(error);
        }
    };
  }, [isAuthenticated, user]); //fix this logic TODO

  const loadInitialFeed = async () => {
    setLoading(true);
    try {
      const response = await PostService.getNewFeed("40"); // Initially load the feed
      console.log(response.data.data);
      if (isAuthenticated && user) response.data.data.posts.forEach((post: any) => {
        post.isSaved = user.savedPosts.includes(post._id);
      });
      setPosts(response.data.data.posts);
    } catch (error) {
        setError('Failed to load posts');
    }
    setLoading(false);
  };

  const loadMorePosts = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const response = await PostService.getNewFeed("10");
      if (isAuthenticated && user) response.data.data.posts.forEach((post: any) => {
        post.isSaved = user.savedPosts.includes(post._id);
      });
      setPosts(prevPosts => [...prevPosts, ...response.data.data.posts]);
      setPage(prevPage => prevPage + 1);
      console.log(response.data.data.posts.length);
      setHasMore(response.data.data.posts.length > 0); // Update if more posts are available
    } catch (error) {
        setError('Failed to load posts');
    }
    setLoading(false);
  };

  const handleSavePost = async (postId: string) => {
    try {
    if (posts.find((post) => post._id === postId).isSaved) await PostService.unsavePost(postId);
    else await PostService.savePost(postId);
    } catch (err) {
        console.error(err);
    }
    await getUser();
  }

  const lastPostElementRef = useCallback((node: any) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        // When the last element is visible, load more posts
        loadMorePosts();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const viewPostDetails = (postId: any) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="container mt-4 feed-container">
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="row">
        {posts?.map((post, index) => (
          <div className="col-md-4 mb-3" key={post._id}>
            <PostItem post={post} onClick={() => viewPostDetails(post._id)}> 
            { isAuthenticated &&
            <div className="post-save-button" onClick={(e) => {e.stopPropagation(); return handleSavePost(post._id);}}>
                {post.isSaved ? <FontAwesomeIcon size='2x' icon={boldBook}/> : <FontAwesomeIcon size='2x' icon={regularBook}/>}
            </div> } </PostItem>
          </div>
        ))}
      </div>
      {loading && <div className="text-center"><Spinner animation="border" /></div>}
      {!loading && posts.length === 0 && <Alert variant="info">No posts to display.</Alert>}
      {!isAuthenticated && (
        <Alert variant="primary">
          To see more posts, please{' '}
          <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
            log in
          </span>{' '}
          or{' '}
          <span onClick={() => navigate('/register')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
            register
          </span>.
        </Alert>
      )}
    </div>
  );
  
};

export default Feed;
