import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PostService, { Post } from '../services/PostService';
import { Button, Card } from 'react-bootstrap'; // Assuming Bootstrap is used
import { useAuth } from '../context/AuthContext';
import UserService from '../services/UserService';
import "./PostDetail.css";


const PostDetail = () => {
  const [post, setPost] = useState<Post | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { postId } = useParams<{ postId: string }>(); // Extracting postId from URL parameters  
  const navigate = useNavigate();
  const [author, setAuthor] = useState("unknown");
  const [authorId, setAuthorId] = useState("");
  const {isAuthenticated, user, getUser} = useAuth();

  useEffect(() => {
    const fetchPost = async (id: string) => {
      try {
        const response = await PostService.getPostById(id);
        setPost(response.data.data.post);
        const authr = response.data.data.post?.author ? await UserService.getOtherUserProfile(response.data.data.post?.author) : undefined;
        setAuthor(authr?.data.data.user.username);
        setAuthorId(authr?.data.data.user._id);
      } catch (error) {
        console.error('Error fetching post', error);
      }
    };
    if(postId) fetchPost(postId);
  }, [postId]);

  useEffect(() => {
    if (!user) getUser();
    if (postId && user)
    try {
        const iisLiked = Object.keys(user?.likedPosts).includes(postId) ? user?.likedPosts?.[`${postId}`] : false;
        console.log(Object.keys(user?.likedPosts));
        console.log(Object.keys(user?.likedPosts).includes(postId));
        console.log(user?.likedPosts?.[`${postId}`]);
        setIsLiked(iisLiked);
        const iisSaved = (user?.savedPosts as string[])?.includes(postId);
        setIsSaved(iisSaved);
        } catch (error) {
            console.log("asdasdddd");
            console.log(error);
            console.log(user);      
        }
  }, [isLiked, isSaved, postId, user]);

  if (!postId) return <div>Post not found</div>

  const handleLike = async () => {
    try {
    if (isLiked) {
      await PostService.unlikePost(postId);
    } else {
      await PostService.likePost(postId);
    }
    } catch (error) {
        console.error(error);
    }
    getUser();
    // setIsLiked(!isLiked);
  };

  const handleSave = async () => {
    try {
    if (isSaved) {
      await PostService.unsavePost(postId);
    } else {
      await PostService.savePost(postId);
    }
}catch (error) {
    console.error(error);
}
    getUser();
    // setIsSaved(!isSaved);
  };

  if (!post) {
    return <div>Loading post...</div>;
  }

  return (
    <>
      <Card className="post-detail-card">
        <Card.Body>
          <Card.Title>{post.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            <Link to={`/profile/${authorId}`}>By {author} on {new Date(post.date).toLocaleDateString()}</Link>
          </Card.Subtitle>
          <Card.Text as="div">
            <p className="text-justify">{post.description}</p>
            {/* Render content with better formatting */}
            <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
          </Card.Text>
          {/* Conditional rendering for Like and Save buttons */}
          {isAuthenticated && (
            <>
              <Button 
                variant={isLiked ? "outline-primary" : "primary"} 
                onClick={handleLike} className="me-2">
                {isLiked ? 'Unlike' : 'Like'}
              </Button>
              <Button 
                variant={isSaved ? "outline-secondary" : "secondary"} 
                onClick={handleSave}>
                {isSaved ? 'Unsave' : 'Save'}
              </Button>
              { author === user?.username &&
              <Button
                variant="outline-secondary"
                onClick={() => navigate(`/posts/edit/${postId}`)}
                className="ms-2"
              >Edit</Button>
            }
            </>
          )}
          {/* Add comment section or related posts if available */}
        </Card.Body>
      </Card>
      <Button variant="outline-secondary" onClick={() => navigate("/")}>Back to Feed</Button>
    </>
  );
};

export default PostDetail;
