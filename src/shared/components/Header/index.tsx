import './index.scss';
import {Avatar, Box, Divider, IconButton, MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {useTranslation} from "react-i18next";
import {switchLanguage} from "../../../slices/language";
import Menu from "@mui/material/Menu";
import {MouseEvent, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import SearchBar from "./components/SearchBar";
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import {graphql} from "../../../gql";
import {useMutation} from "@apollo/client";
import {signedOut} from "../../../slices/user";

const SIGN_OUT_MUTATION = graphql(`
    mutation SignOut {
        signOut {
            success
        }
    }
`);

export default function Header() {
  const {i18n, t} = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.user);

  const [signOut] = useMutation(SIGN_OUT_MUTATION);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const isAuth = !!currentUser.userId;
  if (!isAuth) return <></>;

  const changeLanguage = async (event: SelectChangeEvent) => {
    let newLang = event.target.value;
    await i18n.changeLanguage(newLang);
    dispatch(switchLanguage({language: newLang}));
  }

  const languages = [
    {value: 'en', label: 'en', image: 'https://flagsapi.com/US/flat/64.png'},
    {value: 'vi', label: 'vi', image: 'https://flagsapi.com/VN/flat/64.png'},
  ]

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box>
      <AppBar position="static" color="default"
              sx={{paddingY: 1.2, paddingX: 8, display: 'flex', justifyContent: 'baseline'}}>
        <Toolbar>
          <Box sx={{flexBasis: '15%'}}>
            <Typography variant="h6" fontWeight="bold" fontSize={28} component={Link} to={"/"}
                        sx={{flexGrow: 1, textDecoration: 'none'}}>
              <span style={{color: "#1976D2"}}>Trip</span><span style={{color: "#4CAF50"}}>Connect</span>
            </Typography>
          </Box>

          <Box sx={{flexBasis: '50%'}}>
            <SearchBar/>
          </Box>

          <Box sx={{flexBasis: '6%', marginX: 6, overflowX: 'hidden'}}>
            <Select
              className="border-rounded"
              size={"small"}
              defaultValue={"en"}
              onChange={changeLanguage}
              fullWidth
            >
              {
                languages.map(lang => (
                  <MenuItem key={"lang-" + lang.value} value={lang.value}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                      <img src={lang.image} alt={"flag"} width={20} height={20}/>
                      {lang.label}
                    </Box>
                  </MenuItem>
                ))
              }
            </Select>
          </Box>

          <Box style={{flexBasis: '26%', display: 'flex'}}>
            <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
              <Avatar src={currentUser.avatar} style={{width: 46, height: 46}}/>
            </IconButton>
            <Menu
              sx={{mt: '48px'}}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleCloseUserMenu}>
                <AccountCircleOutlinedIcon fontSize={'medium'}/>
                <Typography
                  sx={{textAlign: 'center', textDecoration: 'none', marginLeft: 0.8}}
                  onClick={() => navigate(`/profile/${currentUser.userId}`)}
                >
                  {t('PROFILE')}
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <SettingsOutlinedIcon fontSize={'medium'}/>
                <Typography
                  sx={{textAlign: 'center', textDecoration: 'none', marginLeft: 0.8}}
                  onClick={() => navigate(`/settings`)}
                >
                  {t('SETTING')}
                </Typography>
              </MenuItem>
              <Divider variant="middle" component="li"/>
              <MenuItem onClick={handleCloseUserMenu}>
                <LogoutIcon fontSize={'small'} sx={{color: '#f44336'}}/>
                <Typography
                  sx={{textAlign: 'center', textDecoration: 'none', marginLeft: 0.8, color: '#f44336'}}
                  onClick={async () => {
                    let response = await signOut();
                    if (response.data?.signOut.success) {
                      navigate("/signin");
                      dispatch(signedOut());
                    }
                    // TODO: Show error alert
                  }}
                >
                  {t('SIGN_OUT')}
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
