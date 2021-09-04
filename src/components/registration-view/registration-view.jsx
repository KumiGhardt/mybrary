import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import './registration-view.scss';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';




export function RegistrationView(props) {
    //call the useState() method (imported from React) with an empty string This method returns an array that you destructure (break down into variables)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');

    /* REVIEW
    const swapView = (e) => {
        e.preventDefault();
        history.push(`/login`);
        // window.location.pathname = `/login`
    }
*/
    const handleRegister = (e) => {
        e.preventDefault();
        // sends request to server for authentication
        // entire URL is in package.json under 'proxy' to get past CORS
        axios.post('https://kumi-movie-index.herokuapp.com/users', {
            Username: username,
            Email: email,
            Password: password,
            Birthday: birthday
        })
            .then(response => {
                const data = response.data;
                alert("Registration Successful!")
                window.location.pathname = `/login`
            })
            .catch(e => {
                console.log(e.response)
            });
    };



    return (

            <container>
                <Form>
                    <Form.Group className="registration-form" controlId="formUsername">
                        <FormLabel>Username:</FormLabel>
                        <Form.Control type="text" value={username} onChange={e => setUsername(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password:</Form.Label>
                        <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email:</Form.Label>
                        <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </Form.Group>

                    <Form.Group controlId="formBirthday">
                        <Form.Label>Date of Birth:</Form.Label>
                        <Form.Control type="date" value={birthday} onChange={e => setBirthday(e.target.value)} />
                    </Form.Group>
                    <Button variant="dark" type="submit" onClick={handleRegister}>
                        Submit
                    </Button>
                </Form>
            </container>

    );
}

RegistrationView.propTypes = {
    register: PropTypes.shape({
        username: PropTypes.string.isRequired,
        password: PropTypes.string.isRequired,
        confirmPassword: PropTypes.string.isRequired,
        birthdate: PropTypes.instanceOf(Date).isRequired
    }),
    onRegister: PropTypes.func,
};