import { useState } from "react";
import { gql, useLazyQuery } from '@apollo/client';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Chip, Container, Grid, TextField } from '@mui/material';

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
        navigate(`/profile`);
    }

    return (
        <Chip variant="outlined" label={displayName} onClick={handleClick} />
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
                            searchedUsers.length > 0 && searchedUsers.map(({ id, displayName }) => id != currentUserId && <UserItem key={id} id={id} displayName={displayName} />)
                        }
                    </div>
                </Grid>
            </Grid>
        </Container>
    );
}
