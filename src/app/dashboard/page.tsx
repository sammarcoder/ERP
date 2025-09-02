import React from 'react'
import Form from './Form'

function page() {
  return (
    <div>page1212
        <Form/>
    </div>
  )
}

export default page






// import React, { useState, useEffect } from 'react';
// import styles from '../styles/CascadingDropdowns.module.css';

// const API_URL = typeof window !== 'undefined' 
//   ? `http://${window.location.hostname}:5000`
//   : 'http://localhost:5000';

// function CascadingDropdowns() {
//   // State management
//   const [users, setUsers] = useState([]);
//   const [posts, setPosts] = useState([]);
//   const [selectedUser, setSelectedUser] = useState('');
//   const [selectedPost, setSelectedPost] = useState('');
//   const [description, setDescription] = useState('');
//   const [status, setStatus] = useState('pending');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [assignments, setAssignments] = useState([]);

//   // Fetch users on component mount
//   useEffect(() => {
//     fetchUsers();
//     fetchAssignments();
//   }, []);

//   // Fetch posts when user changes
//   useEffect(() => {
//     if (selectedUser) {
//       fetchUserPosts(selectedUser);
//     } else {
//       setPosts([]);
//       setSelectedPost('');
//     }
//   }, [selectedUser]);

//   // Clear messages after 3 seconds
//   useEffect(() => {
//     if (successMessage || error) {
//       const timer = setTimeout(() => {
//         setSuccessMessage('');
//         setError('');
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [successMessage, error]);

//   const fetchUsers = async () => {
//     try {
//       const response = await fetch(`${API_URL}/api/users`);
//       if (!response.ok) throw new Error('Failed to fetch users');
//       const data = await response.json();
//       setUsers(data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       setError('Failed to load users');
//     }
//   };

//   const fetchUserPosts = async (userId) => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await fetch(`${API_URL}/api/users/${userId}/posts`);
//       if (!response.ok) throw new Error('Failed to fetch posts');
//       const data = await response.json();
//       setPosts(data);
//       setSelectedPost(''); // Reset post selection
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//       setError('Failed to load posts');
//       setPosts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAssignments = async () => {
//     try {
//       const response = await fetch(`${API_URL}/api/assignments`);
//       if (!response.ok) throw new Error('Failed to fetch assignments');
//       const data = await response.json();
//       setAssignments(data);
//     } catch (error) {
//       console.error('Error fetching assignments:', error);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setSuccessMessage('');
    
//     if (!selectedUser || !selectedPost) {
//       setError('Please select both user and post');
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/api/assignments`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           userId: parseInt(selectedUser),
//           postId: parseInt(selectedPost),
//           description,
//           status
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to create assignment');
//       }

//       const newAssignment = await response.json();
//       setSuccessMessage('Assignment created successfully!');
      
//       // Reset form
//       setSelectedUser('');
//       setSelectedPost('');
//       setDescription('');
//       setStatus('pending');
//       setPosts([]);
      
//       // Refresh assignments list
//       fetchAssignments();
//     } catch (error) {
//       console.error('Error creating assignment:', error);
//       setError(error.message || 'Failed to create assignment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <h1>Create Assignment</h1>
      
//       {/* Messages */}
//       {error && <div className={styles.error}>{error}</div>}
//       {successMessage && <div className={styles.success}>{successMessage}</div>}

//       <form onSubmit={handleSubmit} className={styles.form}>
//         {/* User Dropdown */}
//         <div className={styles.formGroup}>
//           <label htmlFor="user">Select User:</label>
//           <select 
//             id="user"
//             value={selectedUser} 
//             onChange={(e) => setSelectedUser(e.target.value)}
//             className={styles.select}
//             required
//           >
//             <option value="">-- Select User --</option>
//             {users.map(user => (
//               <option key={user.id} value={user.id}>
//                 {user.name} ({user.email})
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Post Dropdown */}
//         <div className={styles.formGroup}>
//           <label htmlFor="post">Select Post:</label>
//           <select 
//             id="post"
//             value={selectedPost} 
//             onChange={(e) => setSelectedPost(e.target.value)}
//             disabled={!selectedUser || loading}
//             className={styles.select}
//             required
//           >
//             <option value="">
//               {loading ? 'Loading posts...' : '-- Select Post --'}
//             </option>
//             {posts.map(post => (
//               <option key={post.id} value={post.id}>
//                 {post.title}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Description */}
//         <div className={styles.formGroup}>
//           <label htmlFor="description">Description:</label>
//           <textarea
//             id="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className={styles.textarea}
//             rows="4"
//             placeholder="Enter assignment description..."
//           />
//         </div>

//         {/* Status */}
//         <div className={styles.formGroup}>
//           <label htmlFor="status">Status:</label>
//           <select
//             id="status"
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             className={styles.select}
//           >
//             <option value="pending">Pending</option>
//             <option value="completed">Completed</option>
//             <option value="cancelled">Cancelled</option>
//           </select>
//         </div>

//         <button 
//           type="submit" 
//           disabled={loading || !selectedUser || !selectedPost}
//           className={styles.submitButton}
//         >
//           {loading ? 'Creating...' : 'Create Assignment'}
//         </button>
//       </form>

//       {/* Assignments List */}
//       <div className={styles.assignmentsList}>
//         <h2>Recent Assignments</h2>
//         {assignments.length === 0 ? (
//           <p>No assignments yet.</p>
//         ) : (
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>User</th>
//                 <th>Post</th>
//                 <th>Status</th>
//                 <th>Created</th>
//               </tr>
//             </thead>
//             <tbody>
//               {assignments.map(assignment => (
//                 <tr key={assignment.id}>
//                   <td>{assignment.id}</td>
//                   <td>{assignment.user?.name}</td>
//                   <td>{assignment.post?.title}</td>
//                   <td>
//                     <span className={`${styles.status} ${styles[assignment.status]}`}>
//                       {assignment.status}
//                     </span>
//                   </td>
//                   <td>{new Date(assignment.createdAt).toLocaleDateString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

// export default CascadingDropdowns;
