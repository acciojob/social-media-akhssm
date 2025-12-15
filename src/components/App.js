import React, { useState } from "react";
import { Switch, Route, Link, useParams, useHistory } from "react-router-dom";

const usersData = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
  { id: "3", name: "Charlie" }
];

const initialPosts = [
  {
    id: "1",
    title: "Hello World",
    content: "First post",
    author: "1",
    reactions: [0, 0, 0, 0, 0]
  }
];

export default function App() {
  const [posts, setPosts] = useState(initialPosts);
  const [notifications, setNotifications] = useState([]);

  return (
    <div className="App">
      <h1>GenZ</h1>

      {/* NAVIGATION */}
      <nav>
        <a href="/">Posts</a>{" "}
        <a href="/users">Users</a>{" "}
        <a href="/notifications">Notifications</a>
      </nav>

      <Switch>
        <Route exact path="/">
          <Posts posts={posts} setPosts={setPosts} />
        </Route>

        <Route exact path="/posts/:id">
          <PostDetail posts={posts} setPosts={setPosts} />
        </Route>

        <Route exact path="/users">
          <Users posts={posts} />
        </Route>

        <Route exact path="/notifications">
          <Notifications
            notifications={notifications}
            setNotifications={setNotifications}
          />
        </Route>
      </Switch>
    </div>
  );
}

/* ---------------- POSTS PAGE ---------------- */

function Posts({ posts, setPosts }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const addPost = () => {
    if (!title || !content || !author) return;

    setPosts([
      ...posts,
      {
        id: Date.now().toString(),
        title,
        content,
        author,
        reactions: [0, 0, 0, 0, 0]
      }
    ]);

    setTitle("");
    setContent("");
    setAuthor("");
  };

  const react = (postId, idx) => {
    setPosts(
      posts.map(p =>
        p.id === postId && idx < 4
          ? {
              ...p,
              reactions: p.reactions.map((r, i) =>
                i === idx ? r + 1 : r
              )
            }
          : p
      )
    );
  };

  return (
    <>
      {/* CREATE POST */}
      <div>
        <input
          id="postTitle"
          placeholder="Post title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <select
          id="postAuthor"
          value={author}
          onChange={e => setAuthor(e.target.value)}
        >
          <option value=""></option>
          {usersData.map(u => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>

        <textarea
          id="postContent"
          placeholder="Post content"
          value={content}
          onChange={e => setContent(e.target.value)}
        />

        <button onClick={addPost}>Save Post</button>
      </div>

      {/* POSTS LIST */}
      <div className="posts-list">
        <div></div>

        {posts.map(post => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>

            {/* REACTIONS */}
            {post.reactions.map((count, i) => (
              <button key={i} onClick={() => react(post.id, i)}>
                {count}
              </button>
            ))}

            <Link to={`/posts/${post.id}`}>
              <button className="button">Edit</button>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------- POST DETAIL ---------------- */

function PostDetail({ posts, setPosts }) {
  const { id } = useParams();
  const history = useHistory();

  const post = posts.find(p => p.id === id);

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const save = () => {
    setPosts(
      posts.map(p =>
        p.id === id ? { ...p, title, content } : p
      )
    );
    history.push("/");
  };

  return (
    <div className="post">
      <input
        id="postTitle"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        id="postContent"
        value={content}
        onChange={e => setContent(e.target.value)}
      />

      <button className="button" onClick={save}>
        Save
      </button>
    </div>
  );
}

/* ---------------- USERS ---------------- */

function Users({ posts }) {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <>
      <ul>
        {usersData.map(u => (
          <li key={u.id} onClick={() => setSelectedUser(u.id)}>
            <li>{u.name}</li>
          </li>
        ))}
      </ul>

      {selectedUser &&
        posts
          .filter(p => p.author === selectedUser)
          .map(p => (
            <div key={p.id} className="post">
              <h3>{p.title}</h3>
              <p>{p.content}</p>
            </div>
          ))}
    </>
  );
}

/* ---------------- NOTIFICATIONS ---------------- */

function Notifications({ notifications, setNotifications }) {
  const refresh = () => {
    setNotifications([
      { id: 1, text: "New Post Added" },
      { id: 2, text: "New Reaction" }
    ]);
  };

  return (
    <>
      <button className="button" onClick={refresh}>
        Refresh Notifications
      </button>

      <section className="notificationsList">
        {notifications.map(n => (
          <div key={n.id}>{n.text}</div>
        ))}
      </section>
    </>
  );
}
