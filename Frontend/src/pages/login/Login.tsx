import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./login.css";
import AuthType from "../../enum/Auth";
import { authorize, register, checkUsername } from '../../request/api';
import Button from '../../components/buttons/Button';
import { AxiosError } from 'axios';
import { ApiResponse } from '../../enum/apiTypes';
import Notification from '../../components/notification/Notification'; // Импортируйте компонент уведомления

interface AuthTypeProp {
    action: AuthType;
}

const Login: React.FC<AuthTypeProp> = ({ action }) => {
    const [isLogin, setIsLogin] = useState(action === AuthType.LOGIN);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<{ email?: string; username?: string; password?: string }>({});
    const [notification, setNotification] = useState<string | null>(null);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        setEmail('');
        setUsername('');
        setPassword('');
        setError({});
        setUsernameAvailable(null);
    }, [isLogin]);

    const handleToggleLogin = () => {
        setIsLogin(!isLogin);
        navigate(isLogin ? '/register' : '/login');
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !username || !password) {
            setError({
                email: !email ? 'Обязательно' : '',
                username: !username ? 'Обязательно' : '',
                password: !password ? 'Обязательно' : ''
            });
            return;
        }
        try {
            const response = await register({ email, username, password });
            if (response.data.detail) {
                if (response.data.detail.includes('email') && response.data.detail.includes('username')) {
                    setError({ 
                        email: 'Пользователь с таким email уже существует.',
                        username: 'Пользователь с таким username уже существует'
                    });
                }
                if (response.data.detail.includes('username')) {
                    setError({ username: 'Пользователь с таким username уже существует' });
                }
                if (response.data.detail.includes('email')) {
                    setError({ username: 'Пользователь с таким email уже существует' });
                }
                return;
            }
            setNotification('Регистрация успешна!');
            navigate('/login');
        } catch (err) {
            const error = err as AxiosError<ApiResponse>;
            if (error.response && error.response.data && error.response.data.detail) {
                if (error.response.data.detail.includes('email')) {
                    setError(prevError => ({ ...prevError, email: error.response?.data.detail }));
                }
                if (error.response.data.detail.includes('username')) {
                    setError(prevError => ({ ...prevError, username: error.response?.data.detail }));
                }
            } else {
                console.log('error', error);
            }
        }
    };

    const handleAuthorize = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError({
                email: !email ? 'Обязательно' : '',
                password: !password ? 'Обязательно' : ''
            });
            return;
        }
        try {
            const response = await authorize({ username: email, password });
            if (response.data.detail) {
                setError({ email: response.data.detail });
                return;
            }
            // Сохраняем токены в localStorage
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            setNotification('Вход успешен!');
            navigate('/chats');
        } catch (err) {
            const error = err as AxiosError<ApiResponse>;
            if (error.response && error.response.data && error.response.data.detail) {
                setError({ email: error.response.data.detail });
            } else {
                console.log('error', error);
            }
        }
    };

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleInputChange = async (field: string, value: string) => {
        if (field === 'email') {
            setEmail(value);
            setError(prevError => ({ ...prevError, email: '' }));
        } else if (field === 'username') {
            setUsername(value);
            setError(prevError => ({ ...prevError, username: '' }));
            setUsernameAvailable(null); // Сброс состояния доступности имени
            if (value.length > 0) {
                try {
                    const response = await checkUsername(value);
                    if (response.data.detail === "Имя занято") {
                        setError(prevError => ({ ...prevError, username: 'Имя занято' }));
                        setUsernameAvailable(false);
                    } else {
                        setError(prevError => ({ ...prevError, username: '' }));
                        setUsernameAvailable(true);
                    }
                } catch (err) {
                    const error = err as AxiosError<ApiResponse>;
                    if (error.response && error.response.data && error.response.data.detail) {
                        setError(prevError => ({ ...prevError, username: error.response?.data.detail }));
                        setUsernameAvailable(false);
                    } else {
                        console.log('error', error);
                    }
                }
            }
        } else if (field === 'password') {
            setPassword(value);
            setError(prevError => ({ ...prevError, password: '' }));
        }
    };

    const handleCloseNotification = () => {
        setNotification(null);
    };

    return (
        <div className="container-login">
            {notification && <Notification message={notification} onClose={handleCloseNotification} />}
            <div className="login">
                <p className="title">{isLogin ? "С возвращением!" : "Создать аккаунт"}</p>
                <form onSubmit={isLogin ? handleAuthorize : handleRegister}>
                    <div className="form-group">
                        <p className={`default-paragraph-color ${error.email ? 'error' : ''}`}>
                            E-MAIL {error.email ? <span className="error-message">{error.email}</span> : <span className="required">*</span>}
                        </p>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={!validateEmail(email) && error.email ? 'error' : ''}
                        />
                    </div>
                    {!isLogin && (
                        <div className="form-group">
                            <p className={`default-paragraph-color ${error.username ? 'error' : ''} ${usernameAvailable ? 'available' : ''}`}>
                                ИМЯ ПОЛЬЗОВАТЕЛЯ {error.username ? <span className="error-message">{error.username}</span> : usernameAvailable ? <span className="available-message">Имя доступно</span> : <span className="required">*</span>}
                            </p>
                            <input
                                type="text"
                                name="username"
                                value={username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <p className={`default-paragraph-color ${error.password ? 'error' : ''}`}>
                            ПАРОЛЬ {error.password ? <span className="error-message">{error.password}</span> : <span className="required">*</span>}
                        </p>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                        />
                    </div>
                    <Button onClick={() => isLogin ? handleAuthorize : handleRegister} children={isLogin ? 'Вход' : 'Продолжить'} className='login-button'/>
                </form>
                <a className="need-account" onClick={handleToggleLogin}>
                    {isLogin ? 'Нужна учетная запись?' : 'Уже зарегистрированы?'}
                </a>
            </div>
        </div>
    );
};

export default Login;
