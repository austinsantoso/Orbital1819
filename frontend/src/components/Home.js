import React from 'react'
import './homestyle.css'

import HomeNoLogin from './LoginPage/HomeNoLogin'
import HomeLogin from './LoginPage/HomeLogin';

class Home extends React.Component {
    render() {
        if (!this.props.username) { // has no username aka hasnt loged in 
            return (
                <HomeNoLogin />
            )
        } else {
            return (
                <HomeLogin username={this.props.username}/>
            )
        }
        
    }
}

export default Home