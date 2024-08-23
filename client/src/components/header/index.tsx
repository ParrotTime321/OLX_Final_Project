import React from 'react';
import { StyledEngineProvider } from '@mui/material/styles'
import { Box, Link } from "@mui/material";
import StyledImage from '../image';
import { Typography } from '@mui/material';
import StyledIconButton from '../iconButton';
import HeartWhiteIcon from '../icons/heartWhite';
import MessageWhiteIcon from '../icons/messageWhite';
import UserProfileWhiteIcon from '../icons/userProfileWhite';
import StyledButton from '../button';
import PlusIcon from '../icons/plus';
import { StyledHeaderDropdown } from '../dropdown';

const Header: React.FC = () => {
    return (
        <StyledEngineProvider injectFirst>
            <Box sx={{
                width: '100vw',
                height: '90px',
                textAlign: 'center',
                backgroundColor: 'var(--dark-blue)',
                position: 'sticky',
                top: '0',
                zIndex: 1000,
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '1360px',
                    height: '100%',
                    margin: '0 auto',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <StyledImage src='https://via.placeholder.com/145x45' alt='logo' width='145px' height='45px' />
                    <Box sx={{
                        display: 'flex',
                        gap: '40px',
                    }}>
                        <Link href="/components-preview" sx={{
                            color: 'white',
                            fontSize: '20px',
                            fontWeight: '400',
                            textDecoration: 'none',
                            alignSelf: 'center',
                        }}>
                            Головна
                        </Link>
                        <Link href="/components-preview" sx={{
                            color: 'white',
                            fontSize: '20px',
                            fontWeight: '400',
                            textDecoration: 'none',
                            alignSelf: 'center',
                        }}>
                            <StyledHeaderDropdown value={'Категорії'} values={["Електроніка", "Одяг"]}/>
                        </Link>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        gap: '30px',
                    }}>
                        <StyledIconButton icon={HeartWhiteIcon} />
                        <StyledIconButton icon={MessageWhiteIcon} />
                        <StyledIconButton icon={UserProfileWhiteIcon} />
                    </Box>
                    <StyledButton text='Додати оголошення' type='contained' icon={PlusIcon} primaryColor='var(--green)' secondaryColor='black' hoverBackColor='var(--light-blue)' className='button-fit'
                        onClick={() => {
                            console.log('Button 2 clicked')
                        }} />
                    <Box sx={{
                        display: 'flex',
                        gap: '8px',
                    }}>
                        <Link href="/components-preview" sx={{
                            color: 'white',
                            fontSize: '20px',
                            fontWeight: '400',
                            textDecoration: 'none',
                            alignSelf: 'center',
                        }}>
                            UA
                        </Link>
                        <Typography sx={{
                            color: 'white',
                            fontSize: '20px',
                            fontWeight: '400',
                            textDecoration: 'none',
                            alignSelf: 'center',
                        }}>
                            |
                        </Typography>
                        <Link href="/components-preview" sx={{
                            color: 'white',
                            fontSize: '20px',
                            fontWeight: '400',
                            textDecoration: 'none',
                            alignSelf: 'center',
                        }}>
                            EN
                        </Link>
                    </Box>
                </Box>
            </Box>
        </StyledEngineProvider>
    );
};

export {
    Header
};