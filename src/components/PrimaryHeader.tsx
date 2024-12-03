import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Paper } from '@mui/material';
import { gql, useLazyQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { shortenFullName, stringToColor } from '../utils/avatar';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const SEARCH_USER_QUERY = gql`
  query Users($searchTerm: String!) {
    users(searchTerm: $searchTerm) {
      id
      displayName
      avatar
    }
  }
`;

export default function PrimaryHeader() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searchUsersEl, setSearchUsersEl] = React.useState(true);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const currentUser = useSelector((state: any) => state.user);
  const [searchUser, { loading, error, data: userSearchedData }] = useLazyQuery(SEARCH_USER_QUERY);
  const navigate = useNavigate();
  const searchUsersRef = useRef<any>();
  const searchScheduler = useRef<any>();
  const dispatch = useDispatch();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const shouldSearchUsersOpen = Boolean(searchUsersEl);
  const { t, i18n } = useTranslation();

  const handleProfileMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: any) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleSearchTermChange = (e: any) => {
    let searchTerm = e.target.value;
    console.log({ searchTerm });
    if (!searchTerm) return;
    clearTimeout(searchScheduler.current);
    searchScheduler.current = setTimeout(() => {
      searchUser({ variables: { searchTerm } });
      setSearchUsersEl(true);
    }, 1000);
  }

  const isAuthenticated = Boolean(currentUser.accessToken);

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {
        isAuthenticated ?
          <div>
            <MenuItem onClick={() => {
              navigate(`/profile/${currentUser.userId}`)
              handleMenuClose();
            }}>
              {t('PROFILE')}
            </MenuItem>
            <MenuItem onClick={() => {
              navigate(`/settings`);
              handleMenuClose();
            }}>
              {t('SETTING')}
            </MenuItem>
            <MenuItem onClick={() => {
              localStorage.clear();
              window.location.href = '/';
              handleMenuClose();
            }}>
              {t('SIGN_OUT')}
            </MenuItem>
          </div> :
          <MenuItem onClick={() => {
            navigate('/signin');
            handleMenuClose();
          }}>
            {t('SIGN_IN')}
          </MenuItem>
      }
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => {
        navigate(`/profile/${currentUser.userId}`);
        handleMobileMenuClose();
      }}>
        {t('PROFILE')}
      </MenuItem>
      <MenuItem onClick={() => {
        navigate(`/settings`);
        handleMobileMenuClose();
      }}>
        {t('SETTING')}
      </MenuItem>
      <MenuItem onClick={() => {
        localStorage.clear();
        window.location.href = '/';
        handleMobileMenuClose();
      }}>
        {t('SIGN_OUT')}
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block', cursor: 'pointer' } }}
            onClick={() => { navigate('/') }}
          >
            TCONNECT
          </Typography>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder={t("SEARCH") + '...'}
              inputProps={{ 'aria-label': 'search', name: 'searchTerm', onKeyUp: handleSearchTermChange, ref: searchUsersRef }}
            />
            {
              (shouldSearchUsersOpen && userSearchedData?.users.length > 0) &&
              <Paper
                style={{
                  padding: 8,
                  position: 'fixed',
                  width: '50vw',
                  maxWidth: '500px',
                }}>
                {
                  userSearchedData.users.map((user: any) => user.id !== currentUser.userId && (
                    <div
                      onClick={() => {
                        searchUsersRef.current.value = '';
                        setSearchUsersEl(false);
                        navigate(`/profile/${user.id}`);
                      }}
                      style={{ display: "flex", alignItems: 'center', marginBottom: 10, cursor: 'pointer' }}
                    >
                      {
                        user.avatar ?
                          <Avatar
                            src={process.env.REACT_APP_BASE_URL + user.avatar}
                            style={{ marginRight: 10, objectFit: "cover", width: 30, height: 30 }}
                          /> :
                          <Avatar
                            sx={{ bgcolor: stringToColor(user.id) }}
                            children={shortenFullName(user.displayName)}
                            style={{ fontSize: '1rem' }} />
                      }
                      <div style={{ marginLeft: 10 }}>{user.displayName}</div>
                    </div>
                  ))
                }
              </Paper>
            }
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {/* Notification area */}
            {
              isAuthenticated && <>
                <IconButton
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                >
                  <Badge badgeContent={17} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </>
            }
            {/* Avatar area */}
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {
                currentUser.accessToken && <Avatar
                  sx={{ bgcolor: stringToColor(currentUser.userId) }}
                  children={shortenFullName(currentUser.displayName)}
                  style={{ fontSize: '1rem' }} />
              }
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
