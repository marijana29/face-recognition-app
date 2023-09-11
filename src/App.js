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
  this.setState((prevState) => ({
    user: {
      ...prevState.user,
      id: data.id,
      name: data.name,
      email: data.email,
      joined: data.joined
    }
  }));
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

  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": "marijana29",
      "app_id": "facerecognitionbrain"
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": this.state.input
          }
        }
      }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key 6399446788964a84813fa6a92d82ca0d'
    },
    body: raw
  };

  fetch("https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs", requestOptions)
    .then(response => response.json())
    .then(data => {
      try {
        // Attempt to access face location information
        const faceData = data.outputs[0].data.regions[0].region_info.bounding_box;

        // Check if faceData is defined
        if (faceData) {
          const image = document.getElementById('inputimage');
          const width = Number(image.width);
          const height = Number(image.height);

          // Extract face location information
          const faceLocation = {
            leftCol: faceData.left_col * width,
            topRow: faceData.top_row * height,
            rightCol: width - (faceData.right_col * width),
            bottomRow: height - (faceData.bottom_row * height)
          };

          // Display the face box
          this.displayFaceBox(faceLocation);

          // Update the user's entry count
          this.setState(prevState => ({
            user: {
              ...prevState.user,
            entries: parseInt(prevState.user.entries, 10) + 1 
            }
          }));
        } else {
          console.log('No face detected');
        }
      } catch (error) {
        console.log('Error processing response:', error);
      }
    })
    .catch(error => {
      console.log('error', error);
      // Handle error
    });
}



 onRouteChange = (route) => {
  if (route === 'signout') {
    this.setState({ isSignedIn: false, imageUrl: '' }); // Reset imageUrl when signing out
  } else if (route === 'home') {
    this.setState({ isSignedIn: true, imageUrl: '' }); // Reset imageUrl when navigating to home
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
