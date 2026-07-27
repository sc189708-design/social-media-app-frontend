import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Api from "../api/axios"
const UserProfile = () => {
    const { id } = useParams();
    const [userProfile, setUserProfile] = useState(null);
    const [userPost, setUserPosts] = useState([]);
    const [isfollowing, setIsFollowing] = useState(false);
    const navigate = useNavigate();
    const currentuser = JSON.parse(localStorage.getItem('user'));

    const fetchUserProfile = useCallback(async () => {
        try {
            const res = await Api.get(`/auth/user/${id}`);
            setUserProfile(res.data);
            setIsFollowing(res.data.followers.includes(currentuser?.id));
        } catch (err) {
            console.error(err);
        }
    }, [currentuser?.id, id]);

    const fetchUserPosts = useCallback(async () => {
        try {
            const res = await Api.get(`/posts`);
            const posts = res.data.filter(post => post.user?._id === id);
            setUserPosts(posts);
        } catch (err) {
            console.error(err);
        }
    }, [id]);

    useEffect(() => {
        const initializeProfile = async () => {
            await fetchUserProfile();
            await fetchUserPosts();
        };

        initializeProfile();
    }, [fetchUserProfile, fetchUserPosts]);

    const handlefollow = async () => {
        try {
            await Api.put(`/auth/follow/${id}`);
            fetchUserProfile();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className=" min-h-screen bg-gray-100">
            {/* nav bar */}
            <nav className="bg-white shadow-md p-4 flex justify-between items-center">
                <h1
                    onClick={() => navigate('/home')}
                    className=" text-2xl font-bold text-blue-600 cursor-pointer"> Social app</h1>
                <button onClick={() => navigate('/home')}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">
                    Back
                </button>
            </nav>
            <div className=" max-w-2xl mx-auto mt-6 pt-4">
                {/* Profile Card */}
                {userProfile && (
                    <div className=" bg-white rounded-xl shadow-md p-8 mb-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-6">
                                {/* Profile Picture */}
                                {userProfile.Profile ? (
                                    <img
                                        src={userProfile.Profile}
                                        alt="Profile"
                                        className="w-20 h-20 rounded-full object-center" />
                                ) : (
                                    <div className="w-20 h-20 bg-blue-500 rounded-full text-white  flex justify-center items-center text-4xl font-bold">
                                        {userProfile.username?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {userProfile.username}
                                    </h2>
                                    <div className="flex gap-4 mt-2 text-gray-500 text-sm">
                                        <span>👥{userProfile.followers.length} followrs</span>
                                        <span>👤{userProfile.following.length} following</span>
                                        <span>📝{userPost.length} posts</span>
                                    </div>
                                </div>
                            </div>
                            {/* Follow Button and this is not show in your profile */}
                            {currentuser.id !== id && (
                                <button
                                    onClick={handlefollow}
                                    className={`px-6 py-2 rounded-lg font-bold transition ${isfollowing
                                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-500'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}>
                                    {isfollowing ? 'Unfollow' : 'Follow'}
                                </button>
                            )}
                        </div>
                    </div>
                )}
                {/* User POsts */}
                <h3 className="text-xl font-bold text-gray-700 mb-4">Posts</h3>
                {userPost.length === 0 ? (
                    <q className="text-center texy-gray-500 bg-white rounded-lg shadow-md p-6">
                        emty posts
                    </q>
                ) : (
                    userPost.map((post) => (
                        <div key={post._id || post.id} className="bg-white shadow-md rounded-xl p-6 mb-4">
                            <div className="flex items-center mb-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex justify-center text-white font-bold mr-3">
                                    {userProfile?.username?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className=" font-bold text-gray-800">
                                        {userProfile?.username}
                                    </p>
                                    <p className=" text-gray-500 text-sm">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            {/* post content */}
                            <p className="text-gray-700 mb-3">{post.description}</p>

                            {/* post image */}
                            {post.image && (
                                <img
                                src={post.image}
                                alt="post"
                                className="w-full rounded-lg mb-3 object-cover max-h-96" 
                                />
                            )}

                            {/* Like and Comment count */}
                            <div className="flex items-center gap-4 text-gray-500 text-sm">
                                <span>👍{post.likes.length} Likes</span>
                                <span>💬{post.comments.length} Comments</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )

}

export default UserProfile