import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

// Metodun iki fgirdisi olan "success" ve "error" birer fonksiyon.
// Burada success ile işimiz yok o nedenle kullanılmadı.
// axios.interceptors.response.use(success, error);

// Metodun kendisi "middleware" galiba bu nedenle rejected promise
// geri dönerek kontrolü catch bloğuna veriyor.
// Aşağıdaki error fonksiyonu response olarak error aldığımız her seferde
// tek bir yerden çalıştırılacaktır. Böylece her metot içine error handling
// yazmaya gerek kalmayacaktır. SADECE UNEXPECTED ERROR handling için kullanılıyor.
axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response && error.response.status >= 400 && error.response.status < 500;
  //console.log('Interceptor Called!');

  if (!expectedError) {
    // Aşağıdaki kısım unexpected error durumu. Burada log'lama yapılması lazım.
    // Normalde hatanın database gibi bir yere kaydedilmesi lazım
    console.log('Error Log: ', error);
    alert('Unexpected Error: Something failed on the server!');
  }

  // Eğer HTTP 400-499 arası hataları aldıysak sadece rejected promise döner
  // Kontrolü aşağıdaki metotlar içindeki "catch" bloğuna aktarır. Orada
  // HTTP 400, 404...vs ayrımı yapılıp ilgili işlemler yapılır.
  return Promise.reject(error);
});

const apiEndpoint = 'https://jsonplaceholder.typicode.com/posts';

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

  // Pessimistic Update
  // handleAdd fonksiyon olarak ayarlanmış bir özelliktir (property)
  handleAdd = async () => {
    const testObj = { title: 'a', body: 'b' };

    const { data: post } = await axios.post(apiEndpoint, testObj);
    // fake api bize sadece oluşturulan yeni objeyi döner

    const posts = [post, ...this.state.posts];
    this.setState({ posts });
  };

  handleUpdate = async post => {
    post.title = 'UPDATED DATA';
    await axios.put(apiEndpoint + '/' + post.id, post); //put metodunda tüm data yollanır (post)
    // const post = await axios.patch(apiEndpoint + "/" + post.id, {
    //   title: post.title,
    // }); //patch metodunda ilgili datalar yollanır (post)

    const posts = [...this.state.posts];
    const index = posts.indexOf(post);

    posts[index] = { ...post };
    this.setState({ posts });
  };

  // Optimistic Update
  handleDelete = async post => {
    const originalPosts = [...this.state.posts];

    const posts = this.state.posts.filter(p => p.id !== post.id);
    this.setState({ posts });

    try {
      await axios.delete(apiEndpoint + '/' + post.id);
      // await axios.delete(apiEndpoint + '/sss/' + post.id); // HTTP 404 hatası için kullan
      // await axios.delete('s' + apiEndpoint + '/' + post.id); // Unsupported protocol hatası için kullan

      //Error simulation
      //throw new Error('');
    } catch (ex) {
      // Expected Error
      if (ex.response && ex.response.status === 404) alert('This post has already been deleted');

      // // Kodun en başındaki axios interceptor kısmı yoksa aşağıdakiler kullanılabilir
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
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }
}

export default App;
