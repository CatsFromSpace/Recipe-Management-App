import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/add-recipe">Add Recipe</Link>
        <Link to="/favorites">Favorites</Link>
      </nav>
    </header>
  )
}

export default Header 