import { Card, Spinner } from "react-bootstrap";
import { PostItem } from "./Feed";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import UserService from "../services/UserService";
import { AxiosError, AxiosResponse } from "axios";
import PostService from "../services/PostService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as boldBook } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as regularBook } from '@fortawesome/free-regular-svg-icons';

export default function Profile() {
    const {user, getUser, isAuthenticated} = useAuth();
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [profile, setProfile] = useState({});
    const [savedPosts, setSavedPosts] = useState<Array<any>>([]);
    const [sharedPosts, setSharedPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();

    const viewPostDetails = (postId: any) => {
        navigate(`/posts/${postId}`);
      };

    const handleSavePost = async (postId: string) => {
        try {
        if ([...savedPosts, ...sharedPosts].find((post) => post._id === postId).isSaved) await PostService.unsavePost(postId);
        else await PostService.savePost(postId);
        } catch (err) {
            console.error(err);
        }
        await getUser();
      }


    useEffect(() => {
        if (!isAuthenticated)
        setError("You must be logged in to view profiles");
    }, [isAuthenticated]);
    useEffect(() => {
        if (userId && user) {setIsOwnProfile(userId === user?._id); console.log(isOwnProfile);
        }
        const fetchProfile = async () => {
            setLoading(true);
            const res = userId ? await UserService.getOtherUserProfile(userId) as AxiosResponse : undefined;
            console.log(res);
            // let query;
            if (isOwnProfile) {
                setProfile(user);
                const sposts = [];
                for (let id of user.savedPosts) {
                    const post = await PostService.getPostById(id);
                    sposts.push(post.data.data.post);
                }
                setSavedPosts(sposts);
                console.log(sposts);
            }
            else if ((profile as any)?._id !== res?.data.data.user._id) {setProfile(res?.data.data.user);}
            if (!profile) throw new Error("asd");
            // else query = {author: (profile as any)?._id};
            const shareds = (await PostService.getPosts(undefined)).data.data.posts.filter((pst: any) => pst.author === (profile as any)?._id);
            setSharedPosts(shareds);
            console.log(shareds);
            setLoading(false);
        }
        setLoading(true);
        if (isAuthenticated && !user) getUser();
        else if (isAuthenticated) {
        if (userId && user) setIsOwnProfile(userId === user?._id);
        try {
            if(!(profile as any)?._id || !(sharedPosts?.length))
        fetchProfile().catch((er) => {
            setError((er as AxiosError).message);
        });
    } catch (error) {
            setError((error as AxiosError).message);
        }
    }
    }, [user, isOwnProfile, userId, profile]);

    if (error) return (<div>{error}</div>);

    if(loading) return (<div className="text-center"><Spinner animation="border" /></div>);

    // if(!isAuthenticated) setError("You must be logged in to view profiles");
    return (
        <div className="profile-container">
  <Card className="profile-card">
    <Card.Body>
      <div className="profile-header">
        <h2 className="text-center">{isOwnProfile ? 'Your Profile' : `${(profile as any)?.name}'s Profile`}</h2>
        {/* {isOwnProfile && <Button variant="secondary" className="edit-profile-btn">Edit Profile</Button>} */}
      </div>
      <div className="profile-content">
        {isOwnProfile && (
          <div className="saved-posts-section">
            <h3>Saved Posts</h3>
            <div className="posts-grid">
              {savedPosts.map(post => (
                <PostItem key={post._id} post={post} onClick={() => viewPostDetails(post._id)} >
                    { isAuthenticated &&
            <div className="post-save-button" onClick={(e) => {e.stopPropagation(); return handleSavePost(post._id);}}>
                {post.isSaved ? <FontAwesomeIcon size='2x' icon={boldBook}/> : <FontAwesomeIcon size='2x' icon={regularBook}/>}
            </div> } 
                </PostItem>
              ))}
            </div>
          </div>
        )}
        <div className="shared-posts-section">
          <h3>{isOwnProfile ? 'Your' : `${(profile as any)?.name}'s`} Shared Posts</h3>
          <div className="posts-grid">
            {sharedPosts.map(post => (
              <PostItem key={post._id} post={post} onClick={() => viewPostDetails(post._id)} >
                { isAuthenticated &&
            <div className="post-save-button" onClick={(e) => {e.stopPropagation(); return handleSavePost(post._id);}}>
                {post.isSaved ? <FontAwesomeIcon size='2x' icon={boldBook}/> : <FontAwesomeIcon size='2x' icon={regularBook}/>}
            </div> } 
              </PostItem>
            ))}
          </div>
        </div>
      </div>
    </Card.Body>
  </Card>
</div>

    );
}