import React, { Component } from "react";
import axios from "axios";
import "./App.css";

const apiEndpoint = "https://jsonplaceholder.typicode.com/posts";

//https://jsonplaceholder.typicode.com/... adresine sorgu çekilecek
class App extends Component {
  state = {
    posts: [],
  };

  // componentDidMount bu class'a ait bir metottur.
  async componentDidMount() {
    // // create promise > pending state > Resolved (success) OR Rejected (failure)
    // const promise = axios.get("https://jsonplaceholder.typicode.com/posts");

    // // promise.then() de kullanılabilir ama javascript await'e de izin veriyor.
    // // bunun için bu fonksiyonu async şekle çevirdik.
    // const response = await promise;
    // // response içinde data kısmı var. Anlaşılması için yukarıdaki kısmı açıklama
    // olarak bırakıyorum. Aşağıdaki kısım kısaltılmış şeklidir.

    const { data: posts } = await axios.get(apiEndpoint);

    this.setState({ posts });
  }

  // handleAdd fonksiyon olarak ayarlanmış bir özelliktir (property)
  handleAdd = async () => {
    const testObj = { title: "a", body: "b" };

    const { data: post } = await axios.post(apiEndpoint, testObj);
    // fake api bize sadece oluşturulan yeni objeyi döner

    const posts = [post, ...this.state.posts];
    this.setState({ posts });
  };

  handleUpdate = async (post) => {
    post.title = "UPDATED DATA";
    await axios.put(apiEndpoint + "/" + post.id, post); //put metodunda tüm data yollanır (post)
    // const post = await axios.patch(apiEndpoint + "/" + post.id, {
    //   title: post.title,
    // }); //patch metodunda ilgili datalar yollanır (post)

    const posts = [...this.state.posts];
    const index = posts.indexOf(post);

    posts[index] = { ...post };
    this.setState({ posts });
  };

  handleDelete = (post) => {
    console.log("Delete", post);
  };

  render() {
    return (
      <React.Fragment>
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
