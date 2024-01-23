import React, { useState, useEffect } from 'react';
import PostService from '../services/PostService';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { AxiosError } from 'axios';
import "./EditPost.css";
import "./CreatePost.css"

const EditPost = () => {
    const [postData, setPostData] = useState({
        id: "",
        title: "",
        description: "",
        content: "",
        author: "",
        date: new Date(),
        tags: "",
        categories: "",
      });
  const [loading, setLoading] = useState(false);
  const history = useNavigate();
  const { user, getUser } = useAuth();
  const { postId } = useParams<{ postId: string }>();
  const [error, setError] = useState('');
  const [fatalError, setFatalError] = useState('');

  useEffect(() => {
    const fetchPostData = async (iid: string) => {
        setLoading(true);
      try {
        const response = await PostService.getPostById(iid);
        if(response.data.data.post.author !== user._id) return (<div>You are not authorized to edit this post.</div>);
        const { title, description, content, tags, categories, id, author, date } = response.data.data.post;
        setPostData({ id, author, date, title, description, content, tags: tags.join(', '), categories: categories.join(', ') });
        setFatalError('');
      } catch (error) {
        console.log('Error fetching post', error);
        setFatalError('Error fetching post');
      }
      setLoading(false);
    };

    postId && user && fetchPostData(postId);
  }, [postId, user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await PostService.updatePost(postId || "undefined", {
        ...postData,
        tags: postData.tags.split(',').map(tag => tag.trim()),
        categories: postData.categories.split(',').map(cat => cat.trim())
      });
      history('/posts/' + postId); // Redirect to the updated post's detail view
    } catch (error) {
        const axiosError = error instanceof AxiosError ? error as AxiosError : undefined;
        const message = axiosError ? (axiosError.response?.data as any)?.message : "Unknown error";
        setError('Error editing post: ' + message);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    try {
      await PostService.deletePost(postId || "undefined");
      history('/posts'); // Redirect after deletion
    } catch (error) {
      console.error('Error deleting post', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };
  return (<div> { fatalError !== '' && <div>{fatalError}</div> }
    <div className="d-flex justify-content-center align-items-center edit-post-container">
      <Card className="post-card">
        <Card.Body>
          <h2 className="text-center">Edit Post</h2>
  <Form onSubmit={handleSubmit}>
    <Form.Group className="mb-3">
      <Form.Label>Title</Form.Label>
      <Form.Control 
        type="text" 
        name="title" 
        value={postData.title} 
        onChange={handleChange} 
        placeholder="Enter title" 
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Description</Form.Label>
      <Form.Control 
        type="text" 
        name="description" 
        value={postData.description} 
        onChange={handleChange} 
        placeholder="Enter description" 
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Content</Form.Label>
      <Form.Control 
        type="text" 
        name="content" 
        value={postData.content} 
        onChange={handleChange} 
        placeholder="Enter content" 
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Tags</Form.Label>
      <Form.Control 
        type="text" 
        name="tags" 
        value={postData.tags} 
        onChange={handleChange} 
        placeholder="Enter tags (separated by commas)" 
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Categories</Form.Label>
      <Form.Control 
        type="text" 
        name="categories" 
        value={postData.categories} 
        onChange={handleChange} 
        placeholder="Enter categories (separated by commas)" 
      />
    </Form.Group>
    <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
      {loading ? 'Updating...' : 'Update Post'}
    </Button>
    <Button variant="danger" onClick={handleDelete} className="w-100 mt-3" disabled={loading}>
      {loading ? '...' : 'Delete Post'}
    </Button>
    <Button
        variant="outline-secondary"
        onClick={() => history('/posts/' + postId)}
        className="w-100 mt-3"
        disabled={loading}
    >Cancel</Button>
    {error && <Alert variant="danger">{error}</Alert>}
  </Form>
  </Card.Body>
      </Card>
    </div>
  </div>
  );
};

export default EditPost;
