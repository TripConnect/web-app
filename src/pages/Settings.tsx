import { FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import LanguageIcon from '@mui/icons-material/Language';

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

    return (
        <Grid container justifyContent='center'>
            <Grid item xs={6}>
                <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                    <span style={{ display: 'inline-block', width: '10%' }}>{t('LANG')}:</span>
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
                </div>
            </Grid>
        </Grid>
    );
}