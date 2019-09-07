import React from 'react'
import {
    Link,
  } from 'react-router-dom';
import TempContent from '../TempContent'

class HomeNoLogin extends React.Component {
    
    
    render() {
        return (
            <div>
                <Link to ="/login"><button className='homeButton'><h3>Login</h3></button></Link>
                <TempContent />
            </div>
        )
    }
}

export default HomeNoLogin