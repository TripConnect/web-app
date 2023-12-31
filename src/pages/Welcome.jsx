import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
import { useDispatch } from "react-redux";
import { LOGIN_INCORRECT } from "../constants/messages";
import { updateToken } from "../slices/user";

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
        id
        username
        displayName
        token {
            accessToken
            refreshToken
        }
    }
  }
`;

export default function Welcome(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let [loginPayload, setLoginPayload] = useState({});
    const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!loginPayload.username || !loginPayload.password) {
            alert(LOGIN_INCORRECT);
            return
        }

        login({ variables: { ...loginPayload } })
            .then(response => {
                if (response?.data?.login) {
                    let { id: userId, token } = response.data.login;
                    let { accessToken, refreshToken } = token;
                    dispatch(updateToken({ accessToken, userId, refreshToken }));
                    navigate("/home");
                } else {
                    alert(LOGIN_INCORRECT);
                }
            });
    }

    const onLoginChange = (e) => {
        setLoginPayload({
            ...loginPayload,
            [e.target.name]: e.target.value,
        })
    }

    return (
        <div>
            <div>
                <input type="text" name="username" placeholder="username..." onChange={onLoginChange} />
                <input type="password" name="password" placeholder="password..." onChange={onLoginChange} />
                <button type="button" onClick={handleSubmit}>Login</button>
            </div>
        </div>
    )
}
