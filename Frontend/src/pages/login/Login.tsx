import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "./login.css";
import AuthType from "../../enum/Auth";
import { register, authorize } from '../../enum/api';

interface AuthTypeProp {
    action: AuthType;
}

const Login: React.FC<AuthTypeProp> = ({ action }) => {
    const [isLogin, setIsLogin] = useState(action === AuthType.LOGIN ? true : false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; username?: string; password?: string }>({});
    const [showNotification, setShowNotification] = useState(false); // Состояние для уведомления
    const navigate = useNavigate();
    const location = useLocation();
    let notific='';

    useEffect(() => {
        if (location.pathname === '/register') {
            setIsLogin(false);
            setErrors({});
        } else {
            setIsLogin(true);
            setErrors({});
        }
    }, [location.pathname]);

    useEffect(() => {
        // Сохранить email при переходе между страницами входа и регистрации
        const preservedEmail = localStorage.getItem('preservedEmail');
        if (preservedEmail) {
            setEmail(preservedEmail);
        }
    }, [isLogin]);

    useEffect(() => {
        // Сохранить email в localStorage при его изменении
        localStorage.setItem('preservedEmail', email);
    }, [email]);

    const handleToggleLogin = () => {
        if (isLogin) {
            navigate('/register');
        } else {
            navigate('/login');
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !username || !password) {
            setErrors({
                email: !email ? 'Обязательно' : '',
                username: !username ? 'Обязательно' : '',
                password: !password ? 'Обязательно' : ''
            });
            return;
        }
        try {
            await register({ email, password });
            notific='Регистрация успешна';
            console.log('Регистрация успешна');
            setShowNotification(true);
            navigate('/login');
        } catch (error: any) {
            console.error('Регистрация не удалась:', error);
            setErrors({
                email: 'Адрес электронной почты уже зарегистрирован',
                username: 'Это имя пользователя уже занято'
            });
        }
    };

    const handleAuthorize = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setErrors({
                email: !email ? 'Обязательно' : '',
                password: !password ? 'Обязательно' : ''
            });
            return;
        }
        try {
            await authorize({ username: email, password });
            notific='Авторизация успешна';
            console.log('Авторизация успешна');
        } catch (error: any) {
            console.error('Авторизация не удалась:', error.message);
            setErrors({ 
                email: 'Неверные данные для входа или пароль',
                password: 'Неверные данные для входа или пароль' });
        }
    };

    const handleInputChange = (field: string, value: string) => {
        if (value) {
            setErrors(prevErrors => ({ ...prevErrors, [field]: '' }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, [field]: 'Обязательно' }));
        }
    };

    return (
        <div className="login">
            <p className="title">{isLogin ? "С возвращением!" : "Создать аккаунт"}</p>
            <form onSubmit={isLogin ? handleAuthorize : handleRegister}>
                <div className="form-group">
                    <p className={errors.email ? 'error-paragraph-color' : 'default-paragraph-color'}>
                        E-MAIL {errors.email ? <span className="error-message">- {errors.email}</span> : <span className="required">*</span>}
                    </p>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            handleInputChange('email', e.target.value);
                        }}
                    />
                </div>
                {!isLogin && (
                    <div className="form-group">
                        <p className={errors.username ? 'error-paragraph-color' : 'default-paragraph-color'}>
                            ИМЯ ПОЛЬЗОВАТЕЛЯ {errors.username ? <span className="error-message">- {errors.username}</span> : <span className="required">*</span>}
                        </p>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                handleInputChange('username', e.target.value);
                            }}
                        />
                    </div>
                )}
                <div className="form-group">
                    <p className={errors.password ? 'error-paragraph-color' : 'default-paragraph-color'}>
                        ПАРОЛЬ {errors.password ? <span className="error-message">- {errors.password}</span> : <span className="required">*</span>}
                    </p>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            handleInputChange('password', e.target.value);
                        }}
                    />
                </div>
                <button type="submit">
                    {isLogin ? 'Вход' : 'Продолжить'}
                </button>
            </form>
            <a className="need-account" onClick={handleToggleLogin}>
                {isLogin ? 'Нужна учетная запись?' : 'Уже зарегистрированы?'}
            </a>
        </div>
    );
};

export default Login;
