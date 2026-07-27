import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../api/axios";

const Profile = () => {
    const [userPosts, setUserPosts] = useState([]);
    const [error, setError] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const [profileImage, setProfileImage] = useState(user?.profile || '');
    const [profileData, setProfileData] = useState(null);
    const navigate = useNavigate();

    const fetchUserPosts = useCallback(async () => {
        try {
            const res = await Api.get('/posts');
            const myPosts = res.data.filter(
                (post) => post.user?._id === user?.id
            );
            setUserPosts(myPosts);
        } catch (err) {
            console.error(err);
            setError('Posts load nahi hui!');
        }
    }, [user?.id]);

    const fetchUserData = useCallback(async () => {
        try {
            const res = await Api.get(`/auth/user/${user.id}`);
            setProfileData(res.data);
            setProfileImage(res.data.profile || '');
        } catch (err) {
            console.error(err);
            setError('Profile data load nahi hui!');
        }
    }, [user?.id]);

    useEffect(() => {
        const initializeProfile = async () => {
            if (!localStorage.getItem('token')) {
                navigate('/');
                return;
            }

            await fetchUserPosts();
            await fetchUserData();
        };

        initializeProfile();
    }, [fetchUserData, fetchUserPosts, navigate]);

    const handleProfilePicture = async (e) => {
        e.preventDefault();
        try {
            const formdata = new FormData();
            formdata.append('profilePicture', profilePic);

            const res = await Api.put('/auth/profile-picture', formdata, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setProfileImage(res.data.profile);

            const updateuser = { ...user, profile: res.data.profile || '' };
            localStorage.setItem('user', JSON.stringify(updateuser));
        } catch (err) {
            console.error(err);
            setError('Profile picture update nahi hui!');
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await Api.delete(`/posts/${postId}`);
            fetchUserPosts();
        } catch (err) {
            console.log(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className='min-h-screen bg-gray-100'>
            {/* Navbar */}
            <nav className='bg-white shadow-md p-4 flex justify-between items-center'>
                <h1
                    onClick={() => navigate('/home')}
                    className='text-2xl font-bold text-blue-600 cursor-pointer'
                >
                    SocialApp
                </h1>
                <button
                    onClick={handleLogout}
                    className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition'
                >
                    Logout
                </button>
            </nav>

            <div className='max-w-2xl mx-auto mt-6 px-4'>
                {/* Profile Card */}
                <div className='bg-white rounded-xl shadow-md p-8 mb-6'>
                    <div className='flex items-center gap-6'>
                        {/* Profile Picture */}
                        <div className=" relative">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="profile"
                                    className="w-20 h-20 rounded-full object-cover" />
                            ) : (
                                < div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        {/* Profile Info */}
                        <div>
                            <h2 className='text-2xl font-bold text-gray-800'>
                                {user?.username}
                            </h2>
                            <p className='text-gray-500'>{user?.email}</p>
                            <p className='text-gray-400 mt-1'>
                                Total Posts: {userPosts.length}
                            </p>
                            <p className='text-gray-400 mt-1 flex gap-3 '>
                                <span>{Array.isArray(profileData?.followers) ? profileData.followers.length : 0} Followers</span>
                                <span>{Array.isArray(profileData?.following) ? profileData.following.length : 0} Following</span>
                            </p>
                        </div>
                    </div>
                    {/* Profile Picture Update */}
                    <form onSubmit={handleProfilePicture} className="mt-4 flex gap-2">
                        <input className=" flex-1 border border-gray-200 rounded-lg p-2"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setProfilePic(e.target.files[0])} />
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition" type="submit">
                            update
                        </button>

                    </form>
                </div>

                {/* My Posts */}
                <h3 className='text-xl font-bold text-gray-700 mb-4'>
                    Meri Posts
                </h3>

                {error && <p className='text-red-500'>{error}</p>}

                {userPosts.length === 0 ? (
                    <p className='text-center text-gray-500 bg-white rounded-xl shadow-md p-6'>
                        Koi post nahi hai abhi!
                    </p>
                ) : (
                    userPosts.map((post) => (
                        <div key={post._id} className='bg-white rounded-xl shadow-md p-6 mb-4'>
                            {/* Post Header */}
                            <div className='flex items-center justify-between mb-3'>
                                <div className='flex items-center'>
                                    <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3'>
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className='font-bold text-gray-800'>{user?.username}</p>
                                        <p className='text-gray-400 text-sm'>
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDeletePost(post._id)}
                                    className='text-red-500 hover:text-red-700 font-bold text-sm'
                                >
                                    🗑️ Delete
                                </button>
                            </div>

                            {/* Post Content */}
                            <p className='text-gray-700 mb-3'>{post.description}</p>

                            {/* Likes & Comments Count */}
                            <div className='flex items-center gap-4 text-gray-500 text-sm'>
                                <span>❤️ {post.likes.length} Likes</span>
                                <span>💬 {post.comments.length} Comments</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Profile;