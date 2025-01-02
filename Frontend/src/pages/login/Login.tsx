import { useState } from 'react'
import "./login.css"
import AuthType from "../../enum/Auth"


interface AuthTypeProp {
    action: AuthType
}

const Login: React.FC<AuthTypeProp> = ({ action }) => {

  const [isLogin, setIsLogin] = useState( action === AuthType.LOGIN ? true : false);
  const handleToggleLogin = () => {
    setIsLogin(!isLogin);
  };

  async function Register() {
        
  }

  async function Authorize() {
   
  }

  return (
    <div className="login">
      <p className="title">{isLogin ? "С возвращением!" : "Создать аккаунт"}</p>
      <form>
        <div className="form-group">
          <p>E-MAIL</p>
          <input type="email" name="email" required />
        </div>
        {!isLogin && (
          <div className="form-group">
            <p>ИМЯ ПОЛЬЗОВАТЕЛЯ</p>
            <input type="text" name="username" required />
          </div>
        )}
        <div className="form-group">
          <p>ПАРОЛЬ</p>
          <input type="password" name="password" required />
        </div>
        <button type="submit" onClick={action === AuthType.LOGIN ? () => Authorize() : () => Register()}>
          {isLogin ?
            'Вход'
          :
            'Продолжить'
          }
        </button>
      </form>
      <a className="need-account" onClick={handleToggleLogin}>
        {isLogin ?
          'Нужна учетная запись?'
        :
          'Уже зарегистрированы?'
        }
      </a>
    </div>
  );
};

export default Login;