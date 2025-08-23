import './index.scss';
import {Avatar, Box, IconButton, MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../store";
import {useTranslation} from "react-i18next";
import {switchLanguage} from "../../../slices/language";

export default function Header() {
  const currentUser = useSelector((state: RootState) => state.user);
  const {i18n} = useTranslation();
  const dispatch = useDispatch();

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


  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static" color={"default"}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{mr: 2}}
          >
            <img id="header-logo" src="/logo512.png" alt="Trip Connect logo"/>
          </IconButton>

          <Typography variant="h6" component="div" fontWeight="bold" sx={{flexGrow: 1}}>
            TripConnect
          </Typography>

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

          <Box style={{marginLeft: 5, display: 'flex', alignItems: 'center', gap: 5}}>
            <Avatar src={currentUser.avatar}/>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
