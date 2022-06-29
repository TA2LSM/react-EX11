import React, { Component } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import http from './services/httpService';
import config from './config.json';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

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

    const { data: posts } = await http.get(config.apiEndpoint);
    this.setState({ posts });
  }

  // Pessimistic Update
  // handleAdd fonksiyon olarak ayarlanmış bir özelliktir (property)
  handleAdd = async () => {
    const testObj = { title: 'NEW DATA', body: 'NEW DATA BODY' };

    const { data: post } = await http.post(config.apiEndpoint, testObj);
    // fake api bize sadece oluşturulan yeni objeyi döner

    const posts = [post, ...this.state.posts];
    this.setState({ posts });

    toast.info('A new post has been added');
  };

  handleUpdate = async post => {
    post.title = 'UPDATED DATA';
    await http.put(config.apiEndpoint + '/' + post.id, post); //put metodunda tüm data yollanır (post)
    // const post = await axios.patch(config.apiEndpoint + "/" + post.id, {
    //   title: post.title,
    // }); //patch metodunda ilgili datalar yollanır (post)

    const posts = [...this.state.posts];
    const index = posts.indexOf(post);

    posts[index] = { ...post };
    this.setState({ posts });

    toast.info('The post has been updated...');
  };

  // Optimistic Update
  handleDelete = async post => {
    const originalPosts = [...this.state.posts];

    const posts = this.state.posts.filter(p => p.id !== post.id);
    this.setState({ posts });

    try {
      await http.delete(config.apiEndpoint + '/' + post.id);
      // await http.delete(config.apiEndpoint + '/sss/' + post.id); // HTTP 404 hatası için kullan
      // await http.delete('s' + config.apiEndpoint + '/' + post.id); // Unsupported protocol hatası için kullan

      //Error simulation
      //throw new Error('');

      toast.success('The post has been deleted');
    } catch (ex) {
      // Expected Error
      if (ex.response && ex.response.status === 404) toast('This post has already been deleted');

      // // Kodun en başındaki axios interceptor kısmı httpService'e taşındı.
      // // o kısım yoksa aşağıdakiler kullanılabilirdi
      // // Expedted Error
      // if (ex.response && ex.response.status === 404) alert('This post has already been deleted');
      // //Unexpected Error
      // else {
      //   // Normalde database'e kaydedilmesi lazım
      //   console.log('Error Log: ', ex);
      //   alert('Unexpected Error: Something failed on the server!');
      // }

      this.setState({ posts: originalPosts });
    }
  };

  render() {
    const toastSettings = {
      position: toast.POSITION.BOTTOM_LEFT,
      autoClose: 2000,
      hideProgressBar: false,
      newestOnTop: true,
      closeOnClick: false,
      pauseOnHover: true,
      theme: 'dark',
    };

    return (
      <div>
        <ToastContainer {...toastSettings} />

        <button
          className='btn btn-primary'
          onClick={this.handleAdd}
        >
          Add
        </button>

        <table className='table'>
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className='btn btn-info btn-sm'
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className='btn btn-danger btn-sm'
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
