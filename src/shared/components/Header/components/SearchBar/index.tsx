import './index.scss';

import {Avatar, Box, InputAdornment, TextField, Typography} from "@mui/material";
import {Search} from "@mui/icons-material";
import {ChangeEvent, useState} from "react";
import {useDebounceCallback} from "usehooks-ts";
import {User} from "../../../../../gql/graphql";
import {useLazyQuery} from "@apollo/client";
import {graphql} from "../../../../../gql";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const SEARCH_USER_QUERY = graphql(`
    query Users($searchTerm: String!) {
        users(searchTerm: $searchTerm) {
            id
            displayName
            avatar
        }
    }
`);

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const {t} = useTranslation();
  const [matchedUsers, setMatchedUsers] = useState<User[]>([]);
  const [searchUsers] = useLazyQuery(SEARCH_USER_QUERY);

  const debouncedSearch = useDebounceCallback(
    (value: string) => {
      console.log("Search:", value);
      searchUsers({variables: {searchTerm: value}})
        .then(response => {
          setMatchedUsers(response.data?.users || []);
        });
    },
    500
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    let searchText = e.target.value;
    setSearchTerm(searchText);
    if (!searchText) {
      setMatchedUsers([]);
      return
    }
    debouncedSearch(searchText);
  }

  return (
    <Box position='relative' width='100%'>
      <TextField
        placeholder={"Search users, destinations, travelers, trips..."}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search/>
            </InputAdornment>
          ),
        }}
        value={searchTerm}
        onChange={handleSearchChange}
        autoComplete='off'
        fullWidth
      />
      {!!matchedUsers.length &&
          <Box position='absolute' width='100%' marginTop={0.8} borderRadius={2.4} zIndex={9999}
               boxShadow={'0 4px 12px rgba(0, 0, 0, 0.15)'}
               sx={{backgroundColor: '#fff'}}>
            {matchedUsers.map((user: User) => (
              <Box className="search-result-item" display='flex' alignItems='center' paddingX={2.4} paddingY={1.8}
                   role='button' onClick={() => {
                setSearchTerm("");
                setMatchedUsers([]);
                navigate("/profile/" + user.id)
              }}>
                <Avatar src={user.avatar} sx={{width: 38, height: 38, marginRight: 1.4}}/>
                <Box>
                  <Typography variant="subtitle1">
                    {user.displayName}
                  </Typography>
                  <Typography variant="subtitle2" color='#757575'>
                    {t("USER")}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>}
    </Box>
  )
}
