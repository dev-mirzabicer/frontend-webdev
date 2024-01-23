import apiService from "./apiService";

export interface Post {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  date: Date;
  tags: string[];
  categories: string[];
}

export const parseResponse = (responseData: any): Post => {
  return {
    title: responseData.title,
    description: responseData.description,
    content: responseData.content,
    author: responseData.author,
    date: new Date(responseData.date),
    tags: responseData.tags,
    categories: responseData.categories,
    id: responseData._id,
  };
};

const getPosts = async (queryParams: any) => {
  return await apiService.get("/post", { params: queryParams });
};

const getPostById = async (postId: string, queryParams?: any) => {
  return await apiService.get(`/post/${postId}`, { params: queryParams });
};

const createPost = async (postData: any) => {
  return await apiService.post("/post", postData);
};

const updatePost = async (postId: string, postData: any) => {
  return await apiService.patch(`/post/${postId}`, postData);
};

const deletePost = async (postId: string) => {
  return await apiService.delete(`/post/${postId}`);
};

const likePost = async (postId: string) => {
  return await apiService.post(`/post/${postId}/likes`);
};

const unlikePost = async (postId: string) => {
  return await apiService.delete(`/post/${postId}/likes`);
};

const savePost = async (postId: string) => {
  return await apiService.post(`/post/${postId}/saves`);
};

const unsavePost = async (postId: string) => {
  return await apiService.delete(`/post/${postId}/saves`);
};

const getNewFeed = async (shown: string = "10") => {
  return await apiService.get("/post/feed", { params: { shown } });
};

const getRestFeed = async (shown: string = "10") => {
  return await apiService.get("/post/feed/current", { params: { shown } });
};

const deleteFeed = async () => {
  return await apiService.delete("/post/feed/current");
};

// Add more post-related methods as needed

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  savePost,
  unsavePost,
  getNewFeed,
  getRestFeed,
  deleteFeed,
};
