import React from 'react';
import { Button } from 'react-bootstrap';

export function LoginButton() {
    return (
        <Button variant="primary" type="submit">Submit</Button>
    )
}

export function Register() {
    return (
        <a href="/register" className="btn btn-danger">
            Register
        </a>
    )
}