import { useState } from "react";
import { gql, useLazyQuery } from '@apollo/client';
import { useNavigate } from "react-router-dom";

const SEARCH_USER_QUERY = gql`
  query Users($searchTerm: String!) {
    users(searchTerm: $searchTerm) {
        id
        displayName
    }
  }
`;

function UserItem(props) {
    const { id, displayName } = props;
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/profile`, { state: { id, displayName } });
    }

    return (
        <div onClick={handleClick}>
            <div>{displayName}</div>
        </div>
    );
}

export default function Home() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const [searchTerm, setSearchTerm] = useState("");
    const [searchUser, { loading, error, data }] = useLazyQuery(SEARCH_USER_QUERY);
    const [searchedUsers, setSearchedUsers] = useState([]);

    const handleSearchTerm = (e) => {
        setSearchTerm(e.target.value);
    }

    const handleSearch = (e) => {
        if (!searchTerm) return;
        searchUser({ variables: { searchTerm } })
            .then(response => {
                if (response?.data?.users) {
                    console.log(response?.data?.users);
                    setSearchedUsers(response.data.users);
                }
            });
    }

    return (
        <div>
            <input type="search" name="searchTerm" placeholder="search..." onChange={handleSearchTerm} />
            <button type="button" onClick={handleSearch}>Search</button>
            {
                searchedUsers ?
                    searchedUsers.map(({ id, displayName }) => id != currentUser.id && <UserItem id={id} displayName={displayName} />) :
                    <div>Not found</div>
            }
        </div>
    );
}
