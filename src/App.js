import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';
import Navigation from './Components/Navigation/Navigation';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import './App.css';





// const particlesOptions = { 
//   particles: {
//     line_linked: {
//       shadow: {
//         enable: true,
//         color: '#3ca9d1',
//         blur: 5
//       }
//     }
//   }
// };


class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }}}

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    };
  }

  displayFaceBox = (box) => {
    this.setState({ box: box });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
  this.setState({ imageUrl: this.state.input });

 
  const userId = 'marijana29';
  const appId = 'facerecognitionbrain';

  // Construct the URL with the user and app IDs
  const imageUrl = this.state.input;
  const apiUrl = `https://api.clarifai.com/v2/models/face-detection/predict?user_id=${userId}&app_id=${appId}`;

  fetch(apiUrl, {
    method: 'post',
    headers: {
      'Authorization': 'Key 6399446788964a84813fa6a92d82ca0d', 
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      inputs: [
        {
          data: {
            image: {
              url: imageUrl
            }
          }
        }
      ]
    })
  })
    .then(response => response.json())
    .then(response => {
      if (response) {
        fetch('https://mybackend-qk20.onrender.com/image', {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count }));
          })
          .catch(console.log);
        }
        this.displayFaceBox(this.calculateFaceLocation(response.outputs[0].data));
      })
      .catch(err => console.log(err));
}





  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ isSignedIn: false });
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  }

  render() {
    const { isSignedIn, imageUrl, route, box} = this.state;
    return (
      <div className="App">
        <ParticlesBg color="#FFFFFF" num={200} type="cobweb" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} name={this.state.user.name} />
        {route === 'home' 
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (route === 'signin' ?
              <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            )
        }
      </div>
    );
  }
}

export default App;
