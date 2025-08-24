import './index.scss';
import {Avatar, Box, IconButton, MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {useTranslation} from "react-i18next";
import {switchLanguage} from "../../../slices/language";
import Menu from "@mui/material/Menu";
import {MouseEvent, useState} from "react";
import {Link} from "react-router-dom";
import SearchBar from "./components/SearchBar";

export default function Header() {
  const currentUser = useSelector((state: RootState) => state.user);
  const {i18n} = useTranslation();
  const dispatch = useDispatch();
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

          <Box sx={{flexBasis: '50%', paddingRight: 5}}>
            <SearchBar/>
          </Box>

          <Box sx={{flexBasis: '5%'}}>
            <Select
              size={"small"}
              defaultValue={"en"}
              onChange={changeLanguage}
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

          <Box style={{flexBasis: '30%', marginLeft: 28, display: 'flex', alignItems: 'center'}}>
            <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
              <Avatar src={currentUser.avatar}/>
            </IconButton>
            <Menu
              sx={{mt: '45px'}}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography component={Link}
                            to={"/profile/" + currentUser.userId}
                            sx={{textAlign: 'center', textDecoration: 'none'}}>
                  Profile
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography component={Link} to={"/settings"} sx={{textAlign: 'center', textDecoration: 'none'}}>
                  Settings
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
