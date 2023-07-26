import { Link } from 'react-router-dom';
import { useContext } from 'react';

import Logo from '../../assets/img/logo.png'
import styles from './Navbar.module.css'

/* Context */
import { Context } from '../../context/UserContext';


function Navbar() {

    const { authenticated, logout } = useContext(Context)
    return (
        <nav className={styles.navbar}>
            <div className={styles.navbar_logo}>
                <img src={Logo} alt="Get a Pet" />
                <h2>Get A Pet</h2>
            </div>
            <ul>
                <li><Link to="/">Adotar</Link></li>
                {authenticated ? (
                    <>
                        <li ><Link to="/pet/myadoptions" >Minhas adoções</Link> </li>
                        <li ><Link to="/pets/mypets" >Meus Pets</Link> </li>
                        <li ><Link to="/user/profile" >Perfil</Link> </li>
                        <li onClick={logout}>Sair</li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Entrar</Link></li>
                        <li><Link to="/register">Cadastrar</Link></li>
                    </>
                )}
            </ul>
        </nav>
    )
}

export default Navbar;