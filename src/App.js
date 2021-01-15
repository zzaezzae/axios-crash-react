import React, { useState, useEffect } from "react";
import axios from "axios";
import Res from "./Res";
import "./App.css";

function App() {
  const [res, setRes] = useState({});

  // axios globals
  axios.defaults.headers.common["X-Auth-Token"] =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

  // axios instance

  // Intercepting requests & responses
  useEffect(() => {
    axios.interceptors.request.use(
      (config) => {
        console.log(
          `${config.method.toUpperCase()} request sent to ${
            config.url
          } at ${new Date().getTime()}`
        );
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }, []);

  const onClick = (event) => {
    const {
      target: { id },
    } = event;
    switch (id) {
      case "get":
        // axios({
        //   method: "get",
        //   url: "http://jsonplaceholder.typicode.com/todos",
        //   params: {
        //     _limit: 5,
        //   },
        // })
        //   .then((res) => setRes(res))
        //   .catch((err) => console.error(err));
        axios("http://jsonplaceholder.typicode.com/todos?_limit=5", {
          timeout: 5000,
        })
          .then((res) => setRes(res))
          .catch((err) => console.error(err));
        break;
      case "post":
        // axios({
        //   method: "post",
        //   url: "http://jsonplaceholder.typicode.com/todos",
        //   data: {
        //     title: "New to do",
        //     completed: false,
        //   },
        // })
        //   .then((res) => setRes(res))
        //   .catch((err) => console.error(err));
        axios
          .post("http://jsonplaceholder.typicode.com/todos", {
            title: "New to do",
            completed: false,
          })
          .then((res) => setRes(res))
          .catch((err) => console.error(err));
        break;
      case "update":
        axios
          .patch("http://jsonplaceholder.typicode.com/todos/1", {
            title: "Updated to do",
            completed: true,
          })
          .then((res) => setRes(res))
          .catch((err) => console.error(err));
        break;
      case "delete":
        axios
          .delete("http://jsonplaceholder.typicode.com/todos/1")
          .then((res) => setRes(res))
          .catch((err) => console.error(err));
        break;
      case "sim":
        axios
          .all([
            axios.get("http://jsonplaceholder.typicode.com/todos?_limit=5"),
            axios.get("http://jsonplaceholder.typicode.com/posts?_limit=5"),
          ])
          .then(axios.spread((todos, posts) => setRes(posts)))
          .catch((err) => console.error(err));
        break;
      case "headers":
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: "sometoken",
          },
        };
        axios
          .post(
            "http://jsonplaceholder.typicode.com/todos",
            {
              title: "New to do",
              completed: false,
            },
            config
          )
          .then((res) => setRes(res))
          .catch((err) => console.error(err));
        break;
      case "transform":
        const options = {
          method: "post",
          url: "http://jsonplaceholder.typicode.com/todos",
          data: {
            title: "Hello World",
          },
          transformResponse: axios.defaults.transformResponse.concat((data) => {
            data.title = data.title.toUpperCase();
            return data;
          }),
        };
        axios(options).then((res) => setRes(res));
        break;
      case "error":
        axios("http://jsonplaceholder.typicode.com/todoss?_limit=5")
          .then((res) => setRes(res))
          .catch((err) => {
            if (err.response) {
              console.error(err.response.data);
              console.error(err.response.status);
              console.error(err.response.headers);
            } else if (err.request) {
              console.error(err.request);
            } else {
              console.error(err.message);
            }
          });
        // axios("http://jsonplaceholder.typicode.com/todoss?_limit=5", {
        //   validateStatus: (status) => status < 500, //reject only if status is greater or equal to 500
        // })
        //   .then((res) => setRes(res))
        //   .catch((err) => {
        //     if (err.response) {
        //       console.error(err.response.data);
        //       console.error(err.response.status);
        //       console.error(err.response.headers);
        //     } else if (err.request) {
        //       console.error(err.request);
        //     } else {
        //       console.error(err.message);
        //     }
        //   });
        break;
      case "cancel":
        const source = axios.CancelToken.source();
        axios("http://jsonplaceholder.typicode.com/todoss?_limit=5", {
          cancelToken: source.token,
        })
          .then((res) => setRes(res))
          .catch((thrown) => {
            if (axios.isCancel(thrown)) {
              console.log("Request canceled!!!", thrown.message);
            }
          });

        source.cancel("Request canceled!!!!!!!!");
        break;
      case "instance":
        const axiosInstance = axios.create({
          baseURL: "http://jsonplaceholder.typicode.com",
        });
        axiosInstance.get("/comments").then((res) => setRes(res));
        break;
      default:
        break;
    }
  };
  return (
    <div className="container my-5">
      <div className="text-center">
        <h1 className="display-4 text-center mb-3">Axios Crash Course</h1>
        <div className="btn-box">
          <button className="btn btn-primary" id="get" onClick={onClick}>
            GET
          </button>
          <button className="btn btn-info" id="post" onClick={onClick}>
            POST
          </button>
          <button className="btn btn-warning" id="update" onClick={onClick}>
            PUT/PATCH
          </button>
          <button className="btn btn-danger" id="delete" onClick={onClick}>
            DELETE
          </button>
          <button className="btn btn-secondary" id="sim" onClick={onClick}>
            Sim Requests
          </button>
          <button className="btn btn-secondary" id="headers" onClick={onClick}>
            Custom Headers
          </button>
          <button
            className="btn btn-secondary"
            id="transform"
            onClick={onClick}
          >
            Transform
          </button>
          <button className="btn btn-secondary" id="error" onClick={onClick}>
            Error
          </button>
          <button className="btn btn-secondary" id="cancel" onClick={onClick}>
            Cancel
          </button>
          <button className="btn btn-secondary" id="instance" onClick={onClick}>
            Instance
          </button>
        </div>
      </div>
      <hr />
      <div>
        <Res res={res} />
      </div>
    </div>
  );
}

export default App;
