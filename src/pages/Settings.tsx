import { Button, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import LanguageIcon from '@mui/icons-material/Language';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { SystemLanguage } from "constants/lang";
import { switchLanguage } from "slices/language";

export default function Settings() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const currentLanguage = useSelector((state: any) => state.language.currentLanguage);

    const handleLangChange = async (event: SelectChangeEvent) => {
        let newLang = event.target.value;
        await i18n.changeLanguage(newLang);
        dispatch(switchLanguage({ language: newLang }));
    }

    const preIconStyling = { marginRight: 10, marginTop: 2 };

    return (
        <Grid container justifyContent='center'>
            <Grid item xs={8}>
                <h1>{t('SETTING')}</h1>
            </Grid>
            <Grid item xs={8}>
                <h2 style={{ display: 'flex', alignItems: 'center' }}>
                    <LanguageIcon fontSize="medium" style={preIconStyling} />
                    <span>{t('LANG')}</span>
                </h2>
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                    <Select
                        fullWidth
                        size="small"
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        value={currentLanguage}
                        onChange={handleLangChange}
                    >
                        <MenuItem value={SystemLanguage.EN}>English</MenuItem>
                        <MenuItem value={SystemLanguage.VI}>Vietnamese</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={8}>
                <h2 style={{ display: 'flex', alignItems: 'center' }}>
                    <LockOutlinedIcon fontSize="medium" style={preIconStyling} />
                    <span>{t("TWO_FACTOR_AUTHENTICATION")}</span>
                </h2>
                <Button variant="contained">{t("SETUP_2FA")}</Button>
            </Grid>
        </Grid>
    );
}