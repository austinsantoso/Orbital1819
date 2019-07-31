import React from 'react'
import LoginInput from './LoginInput';

import './loginstyle.css'

class LoginMain extends React.Component {
    render() {
        return (
            <LoginInput setUserData={this.props.setUserData} />
        );
    }
}

export default LoginMain