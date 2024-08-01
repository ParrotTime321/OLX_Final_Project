import React from 'react';
import StyledLabel from './components/label';
import StyledButton from './components/button';
import { Container, Box, Typography } from '@mui/material';
import { StyledInput } from './components/input';
import { Mail, RemoveRedEye, Password, Home } from '@mui/icons-material';


const ComponentsPreview = () => {
    return (
        <Container
            sx={{
                display: 'block',
                position: 'sticky',
                top: '50px',
                left: '50px',
                minWidth: '100vw',
                minHeight: '100vh'
            }}>
            <Typography variant="h3">Components Preview</Typography>
            <Box
                sx={{
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    border: '2px solid black',
                    padding: '3px'
                }}>
                <Typography sx={{
                    fontSize: '10px'
                }}>Label :</Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px'
                }}>
                    {/* 
                        Label має такі поля:
                            text: string;
                            type: 'primary'| 'head' | 'with-icon';
                            icon?:React.ElementType<SvgIconProps>;
                    */}
                    <StyledLabel text='Primary Label for display info' type='primary' />
                    <StyledLabel text='Head Label for display info' type='head' />
                    <StyledLabel text='Label with icon for display info' type='with-icon' icon={Home} />
                </Box>

            </Box>
            <Box
                sx={{
                    marginTop: '130px',
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    border: '2px solid black',
                    padding: '3px',
                    backgroundColor: 'lightgrey'
                }}>
                <Typography sx={{
                    fontSize: '10px',
                    color: 'black'
                }}>Input :</Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px'
                }}>
                    {/* 
                        Input має такі поля:
                            label: string;
                            value: string;
                            isPassword?: boolean;
                            iconStart?: SvgIconComponent;
                            iconEnd?: SvgIconComponent;
                            iconEndClick?: () => void;
                            iconStartClick?: () => void;
                    */}
                    <StyledInput label='Пошта' value='test@gmail.com' iconStart={Mail} />
                    <StyledInput label='Пароль' value='password' isPassword iconStart={Password} iconEnd={RemoveRedEye}
                        iconEndClick={
                            () => {
                                console.log('Icon end clicked');
                            }
                        } />
                </Box>
            </Box>
            <Box
                sx={{
                    marginTop: '350px',
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    border: '2px solid black',
                    padding: '3px',
                    backgroundColor: 'lightgrey'
                }}>
                <Typography sx={{
                    fontSize: '10px',
                    color: 'black'
                }}>Button :</Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px'
                }}>
                    {/* 
                        Button має такі поля:
                            text: string;
                            type: 'contained' | 'outlined';
                            primaryColor?: string;
                            secondaryColor?: string;
                            hoverColor?: string;
                            icon?: React.ElementType<SvgIconProps>;
                            onClick?: () => void;
                    */}
                    <StyledButton text='Home' type='outlined' icon={Home} />
                    <StyledButton text='Home' type='contained'
                        onClick={() => {
                            console.log('Button clicked')
                        }} />
                </Box>
            </Box>
        </Container>
    )
}

export default ComponentsPreview;
