import { useState } from "react";
import { gql, useLazyQuery } from '@apollo/client';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Avatar, Button, Chip, Container, Grid, TextField } from '@mui/material';
import { Image } from "@mui/icons-material";

const SEARCH_USER_QUERY = gql`
    query Users($searchTerm: String!) {
        users(searchTerm: $searchTerm) {
            id
            displayName
            avatar
        }
    }
`;

function UserItem(props) {
    const { id, displayName, avatar } = props;
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/profile`, { state: { userId: id, displayName } });
    }

    return (
        <div onClick={handleClick} style={{display: "flex", alignItems: 'center'}}>
            <Avatar 
                src={avatar ? process.env.REACT_APP_BASE_URL + avatar : process.env.REACT_APP_DEFAULT_AVATAR_URL} 
                style={{marginRight: 10, objectFit: "cover", width: 50, height: 50}}
            />
            {displayName}
        </div>
    );
}

export default function Home() {
    const currentUserId = useSelector((state) => state.user.userId);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchUser, { loading, error, data }] = useLazyQuery(SEARCH_USER_QUERY);
    const [searchedUsers, setSearchedUsers] = useState([]);

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    }

    const handleSearch = (e) => {
        if (!searchTerm) return;
        searchUser({ variables: { searchTerm } })
            .then(response => {
                if (response?.data?.users) {
                    setSearchedUsers(response.data.users);
                }
            });
    }

    return (
        <Container>
            <Grid container >
                <Grid item xs={12}>
                    <section style={{
                        display: "flex",
                        justifyContent: "start",
                        alignItems: "baseline",
                        marginTop: 20,
                    }}>
                        <TextField id="searchTerm" name="searchTerm" label="Search field" variant="outlined" onChange={handleSearchTermChange} size={"small"} value={searchTerm} style={{ marginRight: 5 }} />
                        <Button variant="contained" onClick={handleSearch}>Search</Button>
                    </section>
                </Grid>
            </Grid>

            <Grid container>
                <Grid item xs={12}>
                    <div style={{
                        marginTop: 10,
                    }}>
                        {
                            searchedUsers.length > 0 && searchedUsers.map(user => user.id != currentUserId && <UserItem key={user.id} {...user} />)
                        }
                    </div>
                </Grid>
            </Grid>
        </Container>
    );
}
