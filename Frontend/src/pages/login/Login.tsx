import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./login.css";
import AuthType from "../../enum/Auth";
import { authorize } from '../../enum/api';
import Button from '../../components/buttons/Button';

interface AuthTypeProp {
    action: AuthType;
}

const Login: React.FC<AuthTypeProp> = ({ action }) => {
    const [isLogin, setIsLogin] = useState(action === AuthType.LOGIN);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<{ email?: string; username?: string; password?: string }>({});
    const navigate = useNavigate();

    const handleToggleLogin = () => {
        setIsLogin(!isLogin);
        navigate(isLogin ? '/register' : '/login');
    };


    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        // Логика регистрации
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
            navigate('/');
        } catch { console.log('error'); }
    };
    

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <div className="container-login">
            <div className="login">
                <p className="title">{isLogin ? "С возвращением!" : "Создать аккаунт"}</p>
                <form onSubmit={isLogin ? handleAuthorize : handleRegister}>
                    <div className="form-group">
                        <p className={`default-paragraph-color ${!email && error ? 'error' : ''}`}>
                            E-MAIL <span className="required">*</span>
                        </p>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={!validateEmail(email) && error ? 'error' : ''}
                        />
                    </div>
                    {!isLogin && (
                        <div className="form-group">
                            <p className="default-paragraph-color">
                                ИМЯ ПОЛЬЗОВАТЕЛЯ <span className="required">*</span>
                            </p>
                            <input
                                type="text"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <p className={`default-paragraph-color ${!password && error ? 'error' : ''}`}>
                            ПАРОЛЬ <span className="required">*</span>
                        </p>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
