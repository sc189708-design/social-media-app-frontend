import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import Api from "../api/axios";

const Home = () => {
    const [profile, setprofile] = useState([ ])
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
            const respro = await Api.get(`/auth/user/${user.id}`)
            console.log('Post image url: ', res.data[0]?.image)
            console.log("Complete Profile Data:", respro.data);
console.log("Profile Image:", respro.data.profile);


            setpost(res.data)
            setprofile(respro.data.profile)
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
    <div className="min-h-screen bg-[#09090f] text-white">

        {/* Navbar */}
        <nav className="sticky top-0 z-50 bg-[#11111b]/90 backdrop-blur-xl border-b border-white/10">
            <div className="max-w-350 mx-auto px-5 py-4 flex items-center justify-between">

                <h1 className="text-2xl font-extrabold tracking-tight">
                    Ghost<span className="text-purple-500 text-xl">.Chating</span>
                </h1>

                <div className="flex items-center gap-3 sm:gap-5">

                    <span className="hidden sm:block text-gray-400 text-sm">
                        Welcome, <span className="text-white font-semibold">{user?.username}</span>
                    </span>

                    <button
                        onClick={() => navigate('/Profile')}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-purple-600 transition-all text-sm font-semibold"
                    >
                        My Profile
                    </button>

                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm font-semibold"
                    >
                        Logout
                    </button>

                </div>
            </div>
        </nav>

        {/* Main Layout */}
        <main className="max-w-350 mx-auto px-4 sm:px-6 py-8">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">

                {/* Left Sidebar */}
                <aside className="hidden lg:block lg:col-span-3">
                    <div className="sticky top-24 space-y-5">

                        <div className="bg-[#15151f] border border-white/10 rounded-2xl p-5">

                            <div className="flex items-center gap-3 mb-7">

                                <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xl font-bold">
                                    {user?.profile && <img src={user.profile} alt="Profile" className="w-full h-full rounded-full object-cover" />}
                                </div>

                                <div className="min-w-0">
                                    <h3 className="font-bold truncate">{user?.username}</h3>
                                    <p className="text-gray-500 text-xs">Your social space</p>
                                </div>

                            </div>

                            <div className="space-y-2">

                                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-purple-600/15 text-purple-400 font-semibold text-sm">
                                    <span>🏠</span> Home Feed
                                </button>

                                <button className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition">
                                    <span>🔍</span> Explore
                                </button>

                                <button
                                    onClick={() => navigate('/Profile')}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition"
                                >
                                    <span>👤</span> My Profile
                                </button>

                            </div>
                        </div>

                        <div className="bg-[#15151f] border border-white/10 rounded-2xl p-5">
                            <h3 className="text-sm font-bold text-white mb-3">
                                About Ghost
                            </h3>
                            <p className="text-gray-500 text-xs leading-6">
                                A place to share your thoughts, connect with people and express yourself.
                            </p>
                        </div>

                    </div>
                </aside>

                {/* Center Feed */}
                <section className="lg:col-span-6 space-y-6">

                    {/* Welcome Banner */}
                    <div className="relative overflow-hidden bg-linear-to-br from-purple-700 via-indigo-700 to-blue-800 rounded-3xl p-6 sm:p-8">
                        <div className="absolute w-48 h-48 bg-white/10 rounded-full blur-3xl -right-10 -top-10"></div>

                        <div className="relative z-10">
                            <p className="text-purple-200 text-sm font-medium mb-2">
                                YOUR COMMUNITY, YOUR SPACE
                            </p>
                            <div className="rounded-full w-30 h-30 overflow-hidden border-2 border-white/20">
                                {user?.profile ? (
                                    <img src={user.profile} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-lg">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>

                            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                                Hey, {user?.username}! 👋
                            </h2>

                            <p className="text-indigo-100 text-sm">
                                What's happening in your world today?
                            </p>
                        </div>
                    </div>

                    {/* Create Post */}
                    <div className="bg-[#15151f] border border-white/10 rounded-2xl p-5 sm:p-6">

                        <div className="flex items-center gap-3 mb-5">

                            <div className="w-16 h-16 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-lg">
                                {user?.profile ? (
                                    <img src={user.profile} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    user?.username?.charAt(0).toUpperCase()
                                )}
                            </div>

                            <div>
                                <h3 className="font-semibold text-white">
                                    Create a post
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Share something with the community
                                </p>
                            </div>

                        </div>

                        {error && (
                            <p className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 text-sm">
                                {error}
                            </p>
                        )}

                        <form onSubmit={handleCreatePost}>

                            <textarea
                                className="w-full bg-[#0d0d15] border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 resize-none outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all"
                                rows="4"
                                placeholder="What's on your mind?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">

                                <label className="flex items-center gap-2 text-gray-400 hover:text-purple-400 cursor-pointer transition text-sm">
                                    <span className="text-xl">📷</span>
                                    Add Photo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => setImage(e.target.files[0])}
                                    />
                                </label>

                                <button
                                    className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-7 py-3 rounded-xl font-semibold text-sm shadow-lg shadow-purple-600/20 transition-all hover:-translate-y-0.5"
                                    type="submit"
                                >
                                    Publish Post →
                                </button>

                            </div>
                        </form>
                    </div>

                    {/* Feed Heading */}
                    <div className="flex items-center justify-between pt-2">
                        <div>
                            <h2 className="text-xl font-bold">Your Feed</h2>
                            <p className="text-gray-500 text-xs mt-1">
                                Discover what's happening
                            </p>
                        </div>

                        <span className="text-xs text-purple-400 bg-purple-500/10 px-3 py-2 rounded-lg">
                            Latest Posts
                        </span>
                    </div>

                    {/* Posts List */}
                    {posts.length === 0 ? (

                        <div className="bg-[#15151f] border border-white/10 rounded-2xl p-12 text-center">

                            <div className="text-5xl mb-4">📭</div>

                            <h3 className="text-lg font-bold mb-2">
                                No Posts Yet
                            </h3>

                            <p className="text-gray-500 text-sm">
                                Be the first one to share something!
                            </p>

                        </div>

                    ) : (

                        posts.map((post) => (

                            <article
                                key={post._id}
                                className="bg-[#15151f] border border-white/10 rounded-2xl p-5 sm:p-6 hover:border-purple-500/30 transition-all duration-300"
                            >

                                {/* Post Header */}
                                <div className="flex items-center justify-between mb-5">

                                    <div className="flex items-center gap-3 min-w-0">

                                        <div className="w-11 h-11 shrink-0 rounded-full bg-linear-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-lg">
                                            {post.user?.profile ? (
                                                <img src={post.user.profile} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                post.user?.username?.charAt(0).toUpperCase()
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p
                                                className="font-bold text-white hover:text-purple-400 cursor-pointer transition truncate"
                                                onClick={() => navigate(`/user/${post.user?._id}`)}
                                            >
                                                 {post.user?.profile ? (
                                                <img src={post.user.profile} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                post.user?.username?.charAt(0).toUpperCase()
                                            )}
                                            </p>

                                            <p className="text-gray-500 text-xs mt-1">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                    </div>

                                    {post.user?._id?.toString() === user?.id?.toString() && (

                                        <button
                                            onClick={() => handleDeletePost(post._id)}
                                            className="text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-lg text-xs font-semibold transition"
                                        >
                                            🗑️ Delete
                                        </button>

                                    )}

                                </div>

                                {/* Post Content */}
                                <p className="text-gray-200 text-sm leading-7 whitespace-pre-wrap mb-4">
                                    {post.description}
                                </p>

                                {/* Post Image */}
                                {post.image && (
                                    <div className="rounded-xl overflow-hidden mb-5 bg-[#0d0d15]">
                                        <img
                                            src={post.image}
                                            alt="Post"
                                            className="w-full max-h-125 object-cover hover:scale-[1.02] transition-transform duration-500"
                                        />
                                    </div>
                                )}

                                {/* Like & Comment Actions */}
                                <div className="flex items-center gap-3 border-t border-white/10 pt-4">

                                    <button
                                        onClick={() => handleLike(post._id)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-purple-500/15 text-gray-300 hover:text-purple-400 transition text-sm font-medium"
                                    >
                                        ❤️ {post.likes.length}
                                    </button>

                                    <button
                                        type="button"
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-purple-500/15 text-gray-300 hover:text-purple-400 transition text-sm font-medium"
                                    >
                                        💬 {post.comments.length}
                                    </button>

                                </div>

                                {/* Comments */}
                                <div className="mt-5 pt-4 border-t border-white/10">

                                    <h4 className="text-sm font-semibold text-gray-300 mb-4">
                                        Comments ({post.comments.length})
                                    </h4>

                                    {post.comments.length > 0 && (

                                        <div className="space-y-3 mb-5">

                                            {post.comments.map((comment, index) => (

                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between gap-2"
                                                >

                                                    <div className="flex items-center gap-2 min-w-0">

                                                        <div className="w-8 h-8 shrink-0 rounded-full bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                                                            {comment.user?.username?.charAt(0).toUpperCase()}
                                                        </div>

                                                        <div className="bg-[#0d0d15] rounded-xl px-3 py-2 min-w-0">
                                                            <span className="font-bold text-white text-xs mr-2">
                                                                {comment.user?.username}
                                                            </span>

                                                            <span className="text-gray-400 text-sm wrap-break-word">
                                                                {comment.text}
                                                            </span>
                                                        </div>

                                                    </div>

                                                    {comment.user?._id?.toString() === user?.id?.toString() && (

                                                        <button
                                                            onClick={() => handleDeleteComment(post._id, comment._id)}
                                                            className="text-red-400 hover:text-red-300 transition text-sm"
                                                        >
                                                            🗑️
                                                        </button>

                                                    )}

                                                </div>

                                            ))}

                                        </div>
                                    )}

                                    {/* Comment Input */}
                                    <div className="flex gap-2">

                                        <input
                                            className="flex-1 min-w-0 bg-[#0d0d15] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500 transition"
                                            type="text"
                                            placeholder="Write a comment..."
                                            value={commentText[post._id] || ""}
                                            onChange={(e) => setCommentText({
                                                ...commentText,
                                                [post._id]: e.target.value
                                            })}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => handleComment(post._id)}
                                            className="bg-purple-600 hover:bg-purple-500 px-4 sm:px-5 rounded-xl text-white text-sm font-semibold transition"
                                        >
                                            Send
                                        </button>

                                    </div>

                                </div>

                            </article>

                        ))

                    )}

                </section>

                {/* Right Sidebar */}
                <aside className="hidden lg:block lg:col-span-3">

                    <div className="sticky top-24 space-y-5">

                        <div className="bg-[#15151f] border border-white/10 rounded-2xl p-5">

                            <h3 className="font-bold text-white mb-4">
                                ✨ Community
                            </h3>

                            <p className="text-gray-500 text-sm leading-6">
                                Share your thoughts, interact with posts and make your voice heard.
                            </p>

                        </div>

                        <div className="bg-linear-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-2xl p-5">

                            <h3 className="font-bold mb-2">
                                💜 Stay Connected
                            </h3>

                            <p className="text-gray-400 text-xs leading-6">
                                Every post is an opportunity to start a conversation.
                            </p>

                        </div>

                    </div>

                </aside>

            </div>

        </main>

    </div>
);
}

export default Home;