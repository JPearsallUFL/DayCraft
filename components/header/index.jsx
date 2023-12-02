import Link from "next/link";
import useLogout from "../../hooks/useLogout";
import {Container, Nav, Navbar, NavDropdown, Row, Col} from 'react-bootstrap'


export default function Header(props) {
  const logout = useLogout();
  return (

    //Header bg controlled by global css, not bootstrap
    <header>
      <Navbar expand = "lg">
        <Container>
          <Navbar.Brand href="/">
            <h1>DayCraft</h1>
            {/* <img 
              src="https://imageupload.io/ib/kK8ODRu2kWfytBI_1699628165.png" 
              height="75"
              className="d-inline-block align-top"
              alt="NANI Logo" 
            /> */}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            {props.isLoggedIn ? (
              <>
              <Nav>
                <Nav.Link href="/" className="fs-5">Home</Nav.Link>
                <Nav.Link href="/note" className="fs-5">Today's Note</Nav.Link>
                <Nav.Link onClick={logout} className="fs-5">Logout</Nav.Link>
              </Nav>
              </>
            ) : (
              <>
              <Nav>
                <Nav.Link href="/" className="fs-5">Home</Nav.Link>
                <Nav.Link href="/login" className="fs-5">Login</Nav.Link>
                <Nav.Link href="/signup" className="fs-5">Signup</Nav.Link>
              </Nav>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

