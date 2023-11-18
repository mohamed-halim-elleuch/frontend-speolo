import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ReactComponent as Hamburger } from '../images/Hamburger.svg'
import { ReactComponent as Cave } from '../images/cave.svg'
import '../css/Navbar.css'
import Button from '@mui/joy/Button';
import { useCheckAuthentication, useLogout } from '../../apis/AuthContext'

const Navbar = () => {
  const checkAuthentication = useCheckAuthentication();
  const [showNavbar, setShowNavbar] = useState(false)
  const logout = useLogout();

  const handleLogOut = async (event) => {
    const check = checkAuthentication();
    console.log('check',check);
    event.preventDefault();
    logout();
  };

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar)
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div >
        <NavLink to="/authenticate/home">
          <Cave className="logo"/>
          </NavLink>
        </div>
        <div className="menu-icon" onClick={handleShowNavbar}>
          <Hamburger className="menu-icon"/>
        </div>
        <div className={`nav-elements  ${showNavbar && 'active'}`}>
          <ul>
            <li>
              <NavLink to="/authenticate/home">Home</NavLink>
            </li>
            <li>
              <NavLink to="/authenticate/contribute">Contribute</NavLink>
            </li>
            <li>
              <NavLink to="/authenticate/search-page">Search</NavLink>
            </li>
            <li>
              <NavLink to="/authenticate/user-profile">User Profile</NavLink>
            </li>
            <li>
              <NavLink to="/authenticate/contact">Contact</NavLink>
            </li>
            <li>
            <Button color="neutral" onClick={handleLogOut} size="sm" variant="solid">Logout</Button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar