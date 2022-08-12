import {Link} from "react-router-dom";

export default function Navbar(props) {
    return (
        <>
        <nav className="navbar navbar-expand-lg bg-light">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">New Project</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link to="/" className="nav-link active" aria-current="page">Home</Link>
                        </li>
                        {localStorage.getItem("token") ? (
                        <li className="nav-item">
                            <Link to="/upload-file" className="nav-link">Upload File</Link>
                        </li>
                        ) : ''}
                        <li className="nav-item">
                            {localStorage.getItem("token") ? <Link to="/logout" className="nav-link">Logout</Link> : <Link to="/login" className="nav-link">Login</Link> }
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        {props.loadingFlag ? 
        <div className="row">
            <div className="col-12" style={{width:'100%', height:'100%', textAlign:'center', fontSize:'18px', zIndex:1, opacity:0.9, background:'#fff', position:'absolute', fontWeight:'bold'}}>
                <div className="spinner-border" role="status"></div>
            </div>
        </div>
        : '' }
        </>
    );
}