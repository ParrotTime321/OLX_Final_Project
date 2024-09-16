import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Header } from '../../components/header';
import { StyledEngineProvider, Box, Button } from '@mui/material';
import StyledFooter from '../../components/footer';
import StyledLabel from '../../components/lable';
import { StyledInput } from '../../components/input';
import { StyledDropdown } from '../../components/dropdown';
import { StyledCheckBox } from '../../components/checkBox';
import StyledButton from '../../components/button';
import { StyledTextArea } from '../../components/textArea';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import imageCompression from 'browser-image-compression';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRef } from 'react';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './styles.css';
import { Category } from '@mui/icons-material';

const AdvertCreatePage: React.FC = () => {
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [categories, setCategories] = useState<{ id: string; name: string; picture: string }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<{ id: string; name: string; picture: string }>();
    const [subCategories, setSubCategories] = useState<string[]>([]);
    const [currencies, setCurrencies] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const storage = getStorage();

    const [errors, setErrors] = useState({
        name: '',
        description: '',
        location: '',
        subCategoryId: '',
        image: '',
    });

    const [formData, setFormData] = useState({
        userId: 'user1234',
        subCategoryId: '',
        name: '',
        description: '',
        price: 0,
        location: '',
        status: '',
        pictures: [''],
        orderType: '',
        currencyId: '',
        delivery: '',
        isHidden: false,
    });

    const uploadResizedImages = async (file: File, path: string) => {
        const sizes = [200, 400, 800];

        try {
            const originalRef = ref(storage, `${path}/original.jpg`);
            await uploadBytes(originalRef, file);

            for (let size of sizes) {
                const options = {
                    maxWidthOrHeight: size,
                    useWebWorker: true,
                };

                const resizedFile = await imageCompression(file, options);
                const resizedRef = ref(storage, `${path}/resized-${size}.jpg`);
                await uploadBytes(resizedRef, resizedFile);
            }

            console.log('Зображення успішно завантажені!');
        } catch (error) {
            console.error('Помилка під час завантаження:', error);
        }
    };

    const uploadMultipleImages = async (files: FileList) => {
        const path = `images/${formData.userId}`;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            await uploadResizedImages(file, `${path}/image-${i}`);

            // Отримуємо URL завантаженого зображення і додаємо його до стану
            const downloadURL = await getDownloadURL(ref(storage, `${path}/image-${i}/original.jpg`));
            setFormData((prevFormData) => ({
                ...prevFormData,
                pictures: [...prevFormData.pictures, downloadURL],
            }));
        }
    };

    const handleMultipleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setSelectedImages([...selectedImages, ...files]);
        if (event.target.files && event.target.files.length > 0) {
            await uploadMultipleImages(event.target.files);
        }
    };

    const handleDeleteImage = (index: number) => {
        setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
        setFormData((prevFormData) => ({
            ...prevFormData,
            pictures: prevFormData.pictures.filter((_, i) => i !== index),
        }));
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async () => {
        let formIsValid = true;
        const newErrors = {
            name: '',
            description: '',
            price: '',
            location: '',
            subCategoryId: '',
            image: '',
        };

        if (!formData.name) {
            newErrors.name = 'Назва обов\'язкова';
            formIsValid = false;
        }

        if (!formData.description) {
            newErrors.description = 'Опис обов\'язковий';
            formIsValid = false;
        }

        if (!formData.location) {
            newErrors.location = 'Місцезнаходження обов\'язкове';
            formIsValid = false;
        }

        if (!formData.subCategoryId) {
            newErrors.subCategoryId = 'Категорія обов\'язкова';
            formIsValid = false;
        }

        if (selectedImages.length === 0) {
            newErrors.image = 'Додайте хоча б одне зображення';
            formIsValid = false;
        }

        setErrors(newErrors);

        if (!formIsValid) {
            setErrorMessage('Будь ласка, заповніть усі обов\'язкові поля.');
            setOpenErrorDialog(true);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/adverts', formData);
            console.log('Advert created successfully', response.data);
        } catch (error) {
            console.error('Error creating advert', error);
            setErrorMessage('Помилка створення оголошення.');
            setOpenErrorDialog(true);
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/categories');

                // const names = response.data.map((category: { name: string }) => category.name);
                console.log(response.data);
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories', error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                const categoryId = selectedCategory?.id;
                if (!categoryId) {
                    return;
                }

                const response = await axios.get(`http://localhost:5000/subcategories/by-category/${categoryId}`);

                const names = response.data.map((subcategory: { name: string }) => subcategory.name);
                setSubCategories(names);
            } catch (error) {
                console.error('Error fetching subcategories', error);
            }
        };

        fetchSubCategories();
    }, []);

    useEffect(() => {
        const fetchCurrency = async () => {
            try {
                const response = await axios.get('http://localhost:5000/currencies');
                const currencies = response.data.map((currency: { abbrEng: string }) => currency.abbrEng);

                console.log(currencies);
                setCurrencies(currencies);
            } catch (error) {
                console.error('Error fetching currencies', error);
            }
        };

        fetchCurrency();
    }, []);

    const fetchCities = async (value: string) => {
        try {
            const response = await axios.post('http://localhost:5000/cities', {
                apiKey: '15d0f1b8de9dc0f5370abcf1906f03cd',
                modelName: "AddressGeneral",
                calledMethod: "getSettlements",
                methodProperties: {
                    FindByString: value
                }
            });
            const cities = response.data.data.map((city: any) => city.Description);
            setCities(cities);
        } catch (error) {
            console.error('Error fetching cities', error);
        }
    };

    const handleNameChange = (value: string) => {
        setFormData({ ...formData, name: value });
    }

    const handleDescriptionChange = (value: string) => {
        setFormData({ ...formData, description: value });
    }

    const handlePriceChange = (value: string) => {
        setFormData({ ...formData, price: parseFloat(value) });
    }

    const handleLocationChange = (value: string) => {
        setFormData({ ...formData, location: value });
    }

    const handleCheckboxChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubCategoryChange = (value: string) => {
        setFormData({ ...formData, subCategoryId: value });
    }

    const handleCurrencyChange = (value: string) => {
        setFormData({ ...formData, currencyId: value });
    }

    return (
        <StyledEngineProvider injectFirst>
            <Header />
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100vw',
                backgroundColor: '#ebeef5',
            }}>
                <form className='form'>
                    <Box sx={{
                        margin: '60px',
                    }}>
                        <StyledLabel text="Створити оголошення" type='head' textType='head' textColor='var(--blue)' />
                    </Box>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '65px',
                        backgroundColor: 'white',
                        borderRadius: '5px',
                        padding: '33px 118px',
                        textAlign: 'left',
                        paddingBottom: '30px',
                    }}>
                        <Box>
                            <StyledLabel text="Заголовок" type='head' textType='head' textColor='black' />
                            <StyledInput value="Вкажіть назву" label='Вкажіть назву' required widthType='large' maxLength={80} onChange={(e) => handleNameChange(e.target.value)} />
                            {errors.name && <div className="error-message">{errors.name}</div>}
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                        }}>
                            <StyledLabel text="Категорія" type='head' textType='head' textColor='black' />
                            <StyledLabel text="Вкажіть категорію*" type='primary' textType='small' textColor='black' />
                            <StyledDropdown selectOnly placeholder='Оберіть категорію' type='large' values={categories.map(category => {
                                return category.name;
                            })} onChange={(e) => categories.forEach(element => {
                                if (element.name === e.target.value) {
                                    setSelectedCategory(element);
                                }
                            })} />
                            <StyledDropdown selectOnly placeholder="Рубрика категорії" type='large' values={subCategories} onChange={(e) => handleSubCategoryChange(e.target.value)} />
                            {errors.subCategoryId && <div className="error-message">{errors.subCategoryId}</div>}
                        </Box>
                    </Box>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        backgroundColor: 'white',
                        borderRadius: '5px',
                        padding: '33px 118px',
                        textAlign: 'left',
                    }}>
                        <StyledLabel text="Місцезнаходження" type='head' textType='head' textColor='black' />
                        <StyledLabel text="Оберіть назву населеного пункту*" type='primary' textType='small' textColor='black' />
                        <StyledDropdown placeholder="Оберіть місто" type='large' values={cities} onInput={(e) => {
                            const value = e.target.value;
                            fetchCities(value);
                        }} onChange={(e) => handleLocationChange(e.target.value)} />
                        {errors.location && <div className="error-message">{errors.location}</div>}
                    </Box>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '65px',
                        backgroundColor: 'white',
                        borderRadius: '5px',
                        padding: '33px 118px',
                        textAlign: 'left',
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '24px',
                        }}>
                            <StyledLabel text="Вид угоди" type='head' textType='head' textColor='black' />
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: '592px',
                                gap: '80px',
                                flexWrap: 'wrap',
                            }}>
                                <StyledCheckBox label='Продам' checked={formData.orderType === "Продам"} onChange={() => handleCheckboxChange('orderType', 'Продам')} />
                                <StyledCheckBox label='Здам в оренду' checked={formData.orderType === "Здам в оренду"} onChange={() => handleCheckboxChange('orderType', 'Здам в оренду')} />
                                <StyledCheckBox label='Безкоштовно' checked={formData.orderType === "Безкоштовно"} onChange={() => handleCheckboxChange('orderType', 'Безкоштовно')} />
                                <StyledCheckBox label='Куплю' checked={formData.orderType === "Куплю"} onChange={() => handleCheckboxChange('orderType', 'Куплю')} />
                                <StyledCheckBox label='Орендую' checked={formData.orderType === "Орендую"} onChange={() => handleCheckboxChange('orderType', 'Орендую')} />
                                <StyledCheckBox label='Обміняю' checked={formData.orderType === "Обміняю"} onChange={() => handleCheckboxChange('orderType', 'Обміняю')} />
                            </Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '24px',
                        }}>
                            <StyledLabel text="Стан" type='head' textType='head' textColor='black' />
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '80px',
                            }}>
                                <StyledCheckBox label='Нове' checked={formData.status === "Нове"} onChange={() => handleCheckboxChange('status', 'Нове')} />
                                <StyledCheckBox label='Вживане' checked={formData.status === "Вживане"} onChange={() => handleCheckboxChange('status', 'Вживане')} />
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        backgroundColor: 'white',
                        borderRadius: '5px',
                        padding: '33px 118px',
                        textAlign: 'left',
                    }}>
                        <StyledLabel text="Ціна" type='head' textType='head' textColor='black' />
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '36px',
                            alignItems: 'end',
                        }}>
                            <StyledInput label='Вкажіть ціну' value="1080" widthType='middle' onChange={(e) => handlePriceChange(e.target.value)} />
                            <StyledDropdown selectOnly placeholder="Валюта" values={currencies} type='middle' onChange={(e) => handleCurrencyChange(e.target.value)} />
                            <StyledCheckBox label='Договірна' />
                        </Box>
                    </Box>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        backgroundColor: 'white',
                        borderRadius: '5px',
                        padding: '33px 118px',
                        textAlign: 'left',
                    }}>
                        <StyledLabel text="Фото" type='head' textType='head' textColor='black' />
                        <StyledLabel text="Додайте фото*" type='primary' textType='small' textColor='black' />
                        <Box className='images-container' sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '24px',
                        }}>
                            {selectedImages.map((image, index) => (
                                <Box
                                    key={index}
                                    className='image-wrapper'
                                    sx={{
                                        position: 'relative',
                                        width: '185px',
                                        height: '185px',
                                    }}
                                >
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Selected image ${index + 1}`}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <IconButton
                                        onClick={() => handleDeleteImage(index)}
                                        className='delete-button'
                                        aria-label="delete"
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            color: 'red',
                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                            '&:hover': {
                                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                            },
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleMultipleImageUpload}
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            multiple
                        />
                        <StyledButton
                            text='Додати фото'
                            type='contained'
                            primaryColor='var(--green)'
                            secondaryColor='black'
                            hoverBackColor='var(--light-blue)'
                            onClick={handleButtonClick}
                        />
                        {errors.image && <div className="error-message">{errors.image}</div>}
                    </Box>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
                        backgroundColor: 'white',
                        borderRadius: '5px',
                        padding: '33px 118px',
                        textAlign: 'left',
                        marginBottom: '120px',
                    }}>
                        <StyledLabel text="Опис оголошення" type='head' textType='head' textColor='black' />
                        <StyledTextArea label='Введіть опис' required value="Будь ласка, додайте опис оголошення" maxLength={9000} minRows={18} onChange={(e) => handleDescriptionChange(e.target.value)} />
                        {errors.description && <div className="error-message">{errors.description}</div>}
                        <StyledButton text='Додати оголошення' type='contained' primaryColor='var(--light-blue)' secondaryColor='white' hoverBackColor='var(--green)' onClick={handleSubmit} />
                    </Box>
                </form>
            </Box>
            <StyledFooter />
            <Dialog
                open={openErrorDialog}
                onClose={() => setOpenErrorDialog(false)}
                aria-labelledby="error-dialog-title"
            >
                <DialogTitle id="error-dialog-title">Error</DialogTitle>
                <DialogContent>
                    <p>{errorMessage}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenErrorDialog(false)} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </StyledEngineProvider >
    );
};

export {
    AdvertCreatePage,
}