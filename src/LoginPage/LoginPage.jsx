import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Form, Button} from 'react-bootstrap'
import './LoginPage.css'
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
    const navigation = useNavigate()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [usernameErrorMessage, setUsernameErrorMessage] = useState([]);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState([]);
    useEffect(() => {
        if(localStorage.getItem('token')) {
            navigation('/dashboard')
        }
    }, [navigation])
    const validateUsername = (username) => {
        if(username.length < 6) {
            setUsernameErrorMessage(["Username min length is 6"])
            return false
        }
        if(username.length > 32) {
            setUsernameErrorMessage(["Username max length is 32"])
            return false
        }
        if(!username.match('^[a-zA-Z0-9]*$')) {
            setUsernameErrorMessage(["The username must contain only letters of the English alphabet and numbers"])
            return false
        }
        setUsernameErrorMessage([])
        return true
    }
    const validatePassword = (password) => {
        if(password.length < 8) {
            setPasswordErrorMessage(["Password min length is 8"])
            return false
        }
        if(password.length > 128) {
            setPasswordErrorMessage(["Username max length is 128"])
            return false
        }
        if(!password.match('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,128}$')) {
            setPasswordErrorMessage(["Password must contain lowercase and uppercase letters, number and special symbols"])
            return false
        }
        setPasswordErrorMessage([])
        return true
    }
    const onChangeUsername = (e) => {
        const username = e.target.value;
        validateUsername(username)
        setUsername(username);
    };
    const onChangePassword = (e) => {
        const password = e.target.value;
        validatePassword(password)
        setPassword(password);
    };
    const onAuth = () => {
        if(!validateUsername(username) || !validatePassword(password)) {
            return
        }
        fetch("https://localhost/api/auth/Login", {
            method: 'post',
            body: JSON.stringify({username: username, password: password}),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((result) => result.json()).then((data) => {
            if (data.hasOwnProperty('errors')) {
                let usernameErrors = []
                let passwordErrors = []
                for (const error of data.errors) {
                    console.log(error)
                    let errorLower = error.toLowerCase()
                    if (errorLower.includes('username')) {
                        usernameErrors.push(error)
                    } else if (errorLower.includes('password')) {
                        passwordErrors.push(error)
                    }
                }
                setUsernameErrorMessage(usernameErrors)
                setPasswordErrorMessage(passwordErrors)
            } else {
                localStorage.setItem('token', data.access_token)
                navigation('/dashboard')
            }
        })
    }
    return (
        <div className='AuthPage'>
            <div className='AuthForm'>
                <Form>
                    <Form.Group className="mb-3 FormGroup">
                        <Form.Label>Username</Form.Label>
                        <Form.Control onChange={onChangeUsername} type="username" placeholder="Enter username"/>
                        {usernameErrorMessage.map(value => <Form.Text>{value}</Form.Text>)}
                    </Form.Group>
                    <Form.Group className="mb-3 FormGroup">
                        <Form.Label>Password</Form.Label>
                        <Form.Control onChange={onChangePassword} type="password" placeholder="Enter password"/>
                        {passwordErrorMessage.map(value => <Form.Text>{value}</Form.Text>)}
                    </Form.Group>
                    <Button variant="primary" onClick={onAuth}>
                        Enter
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default LoginPage