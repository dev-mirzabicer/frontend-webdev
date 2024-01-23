import React, { useState } from 'react';
import PostService from '../services/PostService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { AxiosError } from 'axios';
import "./CreatePost.css";

const CreatePost = () => {
  const [postData, setPostData] = useState({
    id: "",
    title: "",
    description: "",
    content: "",
    author: "",
    date: Date,
    tags: "",
    categories: "",
  });
  

  const history = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  if (!user || user.role !== 'author') {
        return <div>You can't create a post</div>;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await PostService.createPost({
        ...postData,
        tags: postData.tags.split(',').map(tag => tag.trim()), // Assuming tags are comma-separated
        categories: postData.categories.split(',').map(cat => cat.trim()),
        author: user?.id || user?._id
      });
      history('/posts/' + res.data.data.post._id); // Redirect to the post list or another appropriate route
    } catch (error) {
      const axiosError = error instanceof AxiosError ? error as AxiosError : undefined;
      const message = axiosError ? (axiosError.response?.data as any)?.message : "Unknown error";
      setError('Error creating post: ' + message);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

return (
    <div className="d-flex justify-content-center align-items-center create-post-container">
      <Card className="post-card">
        <Card.Body>
          <h2 className="text-center">Create Post</h2>
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
        as="textarea" 
        rows={2}
        name="description" 
        value={postData.description} 
        onChange={handleChange} 
        placeholder="Enter description" 
      />
    </Form.Group>

    <Form.Group className="mb-3">
      <Form.Label>Content</Form.Label>
      <Form.Control 
        as="textarea"
        rows={10} 
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

    
    <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>{loading ? "Creating..." : "Create Post"}</Button>
    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
  </Form>
  </Card.Body>
      </Card>
    </div>
  );
};

export default CreatePost;