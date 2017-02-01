import React, { Component } from 'react';
import gmail from '../gmail.svg';
import github from '../github.svg'
import linkedin from '../linkedin.svg'
import Logo from './Logo';
import Bike from './Bike';
import '../Styles/App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="logos-container">
          <Logo logo={github} alt="github" url="https://github.com/raggiadolf" hint="Check out my projects on Github!" />
          <Logo logo={linkedin} alt="linkedin" url="http://www.linkedin.com/in/ragnararnason" hint="Connect to me via Linkedin!" />
          <Logo logo={gmail} alt="mail" url="mailto:ragnar.adolf@gmail.com" hint="Contact me via email!" />
        </div>
        <Bike />
      </div>
    );
  }
}

export default App;
