import {
    Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl,
    Grid, IconButton, MenuItem, Select, SelectChangeEvent, Skeleton, TextField
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LanguageIcon from '@mui/icons-material/Language';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { gql, useMutation, useQuery } from "@apollo/client";
import { QRCodeSVG } from 'qrcode.react';

import { SystemLanguage } from "constants/lang";
import { switchLanguage } from "slices/language";
import CustomSnakeBar from "components/common/CustomSnakeBar";
import { useNavigate } from "react-router-dom";

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

const ENABLE_2FA_MUTATION = gql`
    mutation Enable2FA($secret: String!, $otp: String!) {
        enable2FA(secret: $secret, otp: $otp) {
            success
        }
    }
`;

function TwoFASetupSection(props: TwoFactorSetupProps) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    let [isOpen, setOpen] = useState(props.isOpen);
    let [otp, setOtp] = useState('');

    const { loading: meLoading, error: meError, data: meData } = useQuery(ME_QUERY);
    const [generatePreview2faSettings, { data: twofaSettingsData, loading, error }] = useMutation(GENERATE_PREVIEW_2FA_MUTATION);
    const [enable2fa, { data: enable2faData, loading: complete2faLoading, error: complete2faError }] = useMutation(ENABLE_2FA_MUTATION);

    useEffect(() => {
        generatePreview2faSettings();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    }

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(e.target.value);
    }

    const handeConfirm2faOtp = () => {
        enable2fa({
            variables: {
                secret: twofaSettingsData?.generate2FASecret?.secret,
                otp
            }
        })
            .then(resp => {
                console.log('Clicked');
                let { success } = resp.data.enable2FA;
                if (success) {
                    navigate(`/`);
                }
            })
            .catch(err => {
                let statusCode = err.graphQLErrors[0].extensions.code;
            });
    }

    return (
        <section>
            <Button
                variant="contained"
                color="success"
                disabled={meData?.me?.enabled2fa || true}
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
                    <DialogContentText id="alert-dialog-subtitle" style={{ marginBottom: 12 }}>
                        {t('SETUP_2FA_SUBTITLE')}
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-qrcode">
                        <center
                            style={{
                                height: 160,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                overflow: 'hidden'
                            }}
                        >
                            {
                                twofaSettingsData?.generate2FASecret?.qrCode ?
                                    <QRCodeSVG width={150} height={150} value={twofaSettingsData.generate2FASecret.qrCode} /> :
                                    <Skeleton variant="rounded" width={150} height={150} animation='wave' />
                            }
                        </center>
                        <center>
                            <code
                                title="Copy to clipboard"
                                style={{
                                    userSelect: 'none',
                                    width: 300,
                                    height: 30,
                                    fontSize: '0.9rem',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: '#eee',
                                    border: 'solid 0.5px grey',
                                    padding: '2px 8px',
                                    borderRadius: 4,
                                    wordBreak: 'break-all',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
                                    const secret = twofaSettingsData?.generate2FASecret?.secret || '';
                                    navigator.clipboard.writeText(secret);
                                }}
                            >
                                <span>{twofaSettingsData?.generate2FASecret?.secret || ''}</span>
                                <ContentCopyIcon fontSize="small" />
                            </code>
                        </center>
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-qrcode" style={{ marginTop: 12 }}>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                overflow: 'visible'
                            }}
                        >
                            <IconButton
                                size="small"
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
                                style={{ width: 150, margin: '0 8px', padding: 0 }}
                                autoComplete="off"
                                onChange={handleOtpChange}
                            />
                            {complete2faError && <CustomSnakeBar message="Invalid OTP" />}
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="success" onClick={handeConfirm2faOtp}>{t('CONFIRM')}</Button>
                    <Button variant="outlined" color="secondary" onClick={handleClose}>{t('CLOSE')}</Button>
                </DialogActions>
            </Dialog>
        </section >
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