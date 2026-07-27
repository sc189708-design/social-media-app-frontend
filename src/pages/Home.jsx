import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import Api from "../api/axios";

const Home = () => {
    const [posts, setpost] = useState([]);
    const [commentText, setCommentText] = useState({});
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [error, seterror] = useState('');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'))

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/');
        } else {
            fetchposts();
        }
    }, []);

    const fetchposts = async () => {
        try {
            const res = await Api.get('/posts')
            console.log('Post image url: ', res.data[0]?.image)
            setpost(res.data)
        } catch (err) {
            seterror('Post load nahi hui!')
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault()
        try {
            const formdata = new FormData()
            formdata.append('description', description);
            if (image) {
                formdata.append('image', image)
            }
            await Api.post('/posts' , formdata, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setDescription('');
            setImage(null)
            fetchposts();
        } catch (err) {
            seterror('post create nahi hui')
        }
    };

    const handleLike = async (postId) => {
        try {
            await Api.put(`/posts/${postId}/like`)
            fetchposts();
        } catch (err) {
            console.log(err)
        }
    };

    const handleComment = async (postId) => {
        try {
            await Api.post(`/posts/${postId}/comment`, { text: commentText[postId] })
            setCommentText({ ...commentText, [postId]: '' })
            fetchposts();
        } catch (err) {
            console.log(err)
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await Api.delete(`/posts/${postId}`)
            fetchposts();
        } catch (err) {
            console.log(err)
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        try {
            console.log('postId', postId)
            console.log('commentId', commentId)
            await Api.delete(`/posts/${postId}/comment/${commentId}`)
            fetchposts();
        } catch (err) {
            console.log('Delte comment error', err.response?.data)
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
                <h1 className='text-2xl font-bold text-blue-600'>Ghost chating</h1>
                <div className='flex items-center gap-4'>
                    <span className='text-gray-600'>Hello, {user?.username}!</span>
                    <button
                        onClick={() => { navigate('/Profile') }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition">
                        Profile
                    </button>
                    <button
                        onClick={handleLogout}
                        className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition'
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className='max-w-2xl mx-auto mt-6 px-4'>
                {/* Create Post */}
                <div className='bg-white rounded-xl shadow-md p-6 mb-6'>
                    <h2 className='text-xl font-bold mb-4 text-gray-700'>Create Post</h2>
                    {error && <p className='text-red-500 mb-2'>{error}</p>}
                    <form onSubmit={handleCreatePost}>
                        <textarea
                            className='w-full border border-gray-300 rounded-lg p-3 mb-3 focus:outline-none focus:border-blue-500'
                            rows='3'
                            placeholder='Kya soch rahe ho?'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                        {/* Image Upload */}
                        <input
                            className='w-full border-gray-300 rounded-lg p-2 mb-3'
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                        />
                        <button
                            className='bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition'
                            type='submit'
                        >
                            Post Karo
                        </button>
                    </form>
                </div>

                {/* Posts List */}
                {posts.length === 0 ? (
                    <p className='text-center text-gray-500'>Koi post nahi hai abhi!</p>
                ) : (
                    posts.map((post) => (
                        <div key={post._id} className='bg-white rounded-xl shadow-md p-6 mb-4'>

                            {/* Post Header */}
                            <div className='flex items-center justify-between mb-3'>
                                <div className='flex items-center'>
                                    <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3'>
                                        {post.user?.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className=" font-bold text-gray-800 cursor-pointer hover:text-blue-500"
                                         onClick={()=> {
                                            console.log('user id', post.user?._id)
                                            navigate(`/user/${post.user?._id}`)
                                         }}>
                                            {post.user?.username}
                                        </p>
                                        <p className='text-gray-400 text-sm'>
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                {/* Delete Post Button */}
                                {post.user?._id?.toString() === user?.id?.toString() && (
                                    <button
                                        onClick={() => handleDeletePost(post._id)}
                                        className='text-red-500 hover:text-red-700 font-bold text-sm'
                                    >
                                        🗑️ Delete
                                    </button>
                                )}
                            </div>

                            {/* Post Content */}
                            <p className='text-gray-700 mb-4'>{post.description}</p>

                            {/* post image */}
                            {post.image && (
                                <img
                                    src={post.image}
                                    alt="post"
                                    className="w-full rounded-lg mb-4 object-cover max-h-96"
                                />
                            )}
                            {/* Like Button */}
                            <div className='flex items-center gap-2'>
                                <button
                                    onClick={() => handleLike(post._id)}
                                    className='flex items-center gap-1 bg-gray-100 px-4 py-2 rounded-lg hover:bg-blue-100 transition'
                                >
                                    ❤️ {post.likes.length}
                                </button>
                                <button className='flex items-center gap-1 bg-gray-100 px-4 py-2 rounded-lg hover:bg-blue-100 transition'>
                                    💬 {post.comments.length}
                                </button>
                            </div>

                            {/* Comment Section */}
                            <div className='mt-4'>
                                {/* Comments List */}
                                {post.comments.length > 0 && (
                                    <div className='mb-3'>
                                        {post.comments.map((comment, index) => (
                                            <div key={index} className='flex items-center justify-between gap-2 mb-2'>
                                                <div className='flex items-center gap-2'>
                                                    <div className='w-7 h-7 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold'>
                                                        {comment.user?.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className='bg-gray-100 rounded-lg px-3 py-1'>
                                                        <span className='font-bold text-sm text-gray-700 mr-2'>
                                                            {comment.user?.username}
                                                        </span>
                                                        <span className='text-sm text-gray-600'>
                                                            {comment.text}
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* Delete Comment Button */}
                                                {comment.user?._id?.toString() === user?.id?.toString() && (
                                                    <button
                                                        onClick={() => handleDeleteComment(post._id, comment._id)}
                                                        className='text-red-400 hover:text-red-600 text-sm'
                                                    >
                                                        🗑️
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Comment Input Box */}
                                <div className='flex gap-2'>
                                    <input
                                        className='flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500'
                                        type='text'
                                        placeholder='Comment likho...'
                                        value={commentText[post._id] || ''}
                                        onChange={(e) => setCommentText({
                                            ...commentText,
                                            [post._id]: e.target.value
                                        })}
                                    />
                                    <button
                                        onClick={() => handleComment(post._id)}
                                        className='bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition'
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Home;