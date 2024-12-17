import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, IconButton, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import LanguageIcon from '@mui/icons-material/Language';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { QRCodeSVG } from 'qrcode.react';

import { SystemLanguage } from "constants/lang";
import { switchLanguage } from "slices/language";
import { Fragment, useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import AutorenewIcon from '@mui/icons-material/Autorenew';

type TwoFactorSetupProps = {
    isOpen: boolean
}

const ME_QUERY = gql`
    query Me {
        me {
            enabled2fa
        }
    }
`;

const GENERATE_PREVIEW_2FA_MUTATION = gql`
    mutation Generate2FASecret {
        generate2FASecret {
            secret
            qrCode
        }
    }
`;

function TwoFASetupSection(props: TwoFactorSetupProps) {
    const { t } = useTranslation();
    let [isOpen, setOpen] = useState(props.isOpen);

    const { loading: meLoading, error: meError, data: meData } = useQuery(ME_QUERY);
    const [generatePreview2faSettings, { data: twofaSettingsData, loading, error }] = useMutation(GENERATE_PREVIEW_2FA_MUTATION);

    useEffect(() => {
        generatePreview2faSettings();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    }

    return (
        <section>
            <Button
                variant="contained"
                color="success"
                disabled={meData?.me.enabled2fa || false}
                onClick={handleClickOpen}
            >
                {t("SETUP_2FA")}
            </Button>

            <Dialog
                open={isOpen}
                aria-labelledby="alert-dialog-2fa"
                aria-describedby="alert-dialog-2fa"
            >
                <DialogTitle id="alert-dialog-2fa">
                    <strong>{t("TWO_FACTOR_AUTHENTICATION")}</strong>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-subtitle">
                        {t('SETUP_2FA_SUBTITLE')}
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-qrcode" style={{ margin: '12px 0' }}>
                        <center>
                            {twofaSettingsData?.generate2FASecret?.qrCode?.length &&
                                <QRCodeSVG width={150} value={twofaSettingsData.generate2FASecret.qrCode} />}
                        </center>
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-qrcode">
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <IconButton
                                size="small"
                                aria-label="show 17 new notifications"
                                color="inherit"
                                onClick={() => generatePreview2faSettings()}
                            >
                                <AutorenewIcon />
                            </IconButton>
                            <TextField
                                id="totp-input"
                                label={t('OTP')}
                                type='search'
                                size="small"
                                variant="outlined"
                                style={{ width: 150, margin: '0 8px' }}
                                autoComplete="off"
                            />
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="success">{t('CONFIRM')}</Button>
                    <Button variant="outlined" color="secondary" onClick={handleClose}>{t('CLOSE')}</Button>
                </DialogActions>
            </Dialog>
        </section>
    );
}

export default function Settings() {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const currentLanguage = useSelector((state: any) => state.language.currentLanguage);
    const preIconStyling = { marginRight: 10, marginTop: 2 };

    const handleLangChange = async (event: SelectChangeEvent) => {
        let newLang = event.target.value;
        await i18n.changeLanguage(newLang);
        dispatch(switchLanguage({ language: newLang }));
    }

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
                <FormControl sx={{ m: 1, minWidth: 200 }}>
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
                <TwoFASetupSection isOpen={false} />
            </Grid>
        </Grid>
    );
}