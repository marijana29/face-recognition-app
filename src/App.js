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
      box: [], // Initialize 'box' as an empty array
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    };
  }

  // ... rest of your code ...

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;

    // Check if 'box' is defined before mapping
    const faceBoxes = box && box.map((item, index) => (
      // Your mapping logic here
      <div key={index} className="bounding-box" style={calculateStyles(item)}></div>
    ));

    return (
      <div className="App">
        <ParticlesBg color="#FFFFFF" num={200} type="cobweb" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} name={this.state.user.name} />
        {route === 'home' ? (
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            {faceBoxes}
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : (
          route === 'signin' ? (
            <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          ) : (
            <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        )}
      </div>
    );
  }
}

export default App;
