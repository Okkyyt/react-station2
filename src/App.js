import "./App.css";
import { useState, useEffect, useCallback } from "react";

import { Routes, Route, Link, useNavigate } from "react-router-dom";

//ホームのページーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
function Home(props) {
  const [threadTitles, setThreadTitles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetch(`${props.url}/threads`, { method: "GET" })
        .then((res) => res.json())
        .then((data) => {
          setThreadTitles(data);
        });
    };

    fetchData();
  }, [props.url]); // マウント時のみ実行するための空の依存配列

  const handleClick = (item) => {
    const value = item;
    props.setThread(value);
  };

  const titleList = () => {
    return threadTitles.map((item) => (
      <div key={item.id}>
        <Link onClick={() => handleClick(item)} to={`/thread/${item.id}`}>
          {item.title}
        </Link>
      </div>
    ));
  };

  return (
    <div className="Home">
      <h2>新着スレッド</h2>
      <div className="container">{titleList()}</div>
    </div>
  );
}

//スレッド作成ページーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
function NewThread(props) {
  const [text, setText] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const createThread = async () => {
    await fetch(`${props.url}/threads`, {
      method: "POST",
      body: JSON.stringify({
        title: text,
      }),
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error(error);
      });
    navigate("/");
  };

  return (
    <div className="test">
      <h2>スレッド新規作成</h2>
      <textarea
        placeholder="スレッド"
        defaultValue={text}
        onChange={handleChange}
        rows="1"
        cols="50"
      ></textarea>
      <Link to="/">TOPに戻る</Link>
      <button onClick={createThread}>作成</button>
    </div>
  );
}

//スレッドの投稿ページーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
function Thread(props) {
  const [contents, setContents] = useState([]);
  const [text, setText] = useState("");

  const fetchThread = useCallback(async () => {
    await fetch(`${props.url}/threads/${props.thread.id}/posts`)
      .then((res) => res.json())
      .then((data) => {
        setContents(data.posts);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [props.url, props.thread]);

  useEffect(() => {
    fetchThread();
  }, [fetchThread]);

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleClick = async () => {
    // setText("");
    await fetch(`${props.url}/threads/${props.thread.id}/posts`, {
      method: "POST",
      body: JSON.stringify({ post: text }),
    })
      .then((res) => res.json())
      .catch((error) => {
        console.error(error);
      });
    await fetchThread();
  };

  const contentsList = () => {
    return contents.map((item) => <p key={item.id}>{item.post}</p>);
  };

  return (
    <div className="Thread">
      <h2>{props.thread.title}</h2>
      <textarea
        placeholder="投稿しよう"
        rows="20"
        cols="50"
        defaultValue={text}
        onChange={handleChange}
      ></textarea>
      <button onClick={handleClick}>投稿</button>
      <div>{contentsList()}</div>
      <Link to="/">TOPに戻る</Link>
    </div>
  );
}

function App() {
  const url = "https://railway.bulletinboard.techtrain.dev";

  const [thread, setThread] = useState({});

  return (
    <div className="App">
      <header className="App-header">
        <h1>掲示板</h1>
        <Link to="/thread/new">スレッドをたてる</Link>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home url={url} setThread={setThread} />} />
          <Route path="/thread/new" element={<NewThread url={url} />} />
          <Route
            path="/thread/:threadId"
            element={<Thread url={url} thread={thread} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
