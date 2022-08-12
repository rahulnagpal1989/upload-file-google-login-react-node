import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from 'axios';
import fileDownload from 'js-file-download'


export default function UploadFile() {
    const [message, setMessage] = useState('');
    const [myfile, setMyFile] = useState('');
    const [filesData, setFilesData] = useState('');
    const[loadingFlag, setLoadingFlag] = useState(false);

    const changeHandler = (event) => {
        event.preventDefault();
		setMyFile(event.target.files[0]);
	};

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!myfile) {
            alert("Please select file.");
        } else {
            uploadFile(myfile);
            setMyFile("");
        }
    };

    const uploadFile = (myfile) => {
        var form_data = new FormData();
        form_data.append('myfile', myfile);
        setLoadingFlag(true);

        axios.post(`${process.env.REACT_APP_API_URL}/uploadFile`, form_data, {
            headers: {
                "Content-Disposition": `form-data; filename=" ${myfile.name}"`,
                'token': localStorage.getItem("token")
            }
        })
        .then((res) => {
            setMyFile("");
            setLoadingFlag(false);
            if(res.data.success === 1) {
                alert(res.data.message);
                setMessage(res.data.message);
                getFiles();
            }
        })
        .catch((err) => {
            setLoadingFlag(false);
            console.log(err);
            setMyFile("");
        });
    };

    const getFiles = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/getFiles`, {}, {
            headers: {
                'Content-Type': 'application/json', 
                'token': localStorage.getItem("token")
            }
        })
        .then((res) => {
            setFilesData(res.data.result);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const downloadFile = (data) => {
        axios.get(`${process.env.REACT_APP_API_URL}/`+data.folder+data.file_name, {
            responseType: 'blob',
        })
        .then((res) => {
            fileDownload(res.data, data.file_name)
        })
    };

    useEffect(()=> {
        getFiles();
    }, []);

    return (
        <>
            <div className="container-fluid">
                <Navbar loadingFlag={loadingFlag} />
                <h1>Upload File</h1>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="row">
                        <div className="col-3">{message}</div>
                        <div className="col-6">
                            <div className="input-group mb-3">
                                <input type="file" name="myfile" className="form-control" id="inputGroupFile02" onChange={changeHandler} />
                                <label className="input-group-text" htmlFor="inputGroupFile02">Upload</label>
                            </div>
                        </div>
                        <div className="col-3"><button type="submit" className="btn btn-primary">Submit</button></div>
                    </div>
                </form>
                <hr/>
                <h2>File Listing</h2>
                <div className="row">
                    <div className="col-12">
                        <ul className="list-group">
                        {
                            filesData && (
                                filesData.map((data)=>{
                                    return <li className="list-group-item d-flex justify-content-between align-items-center" key={data.id}>{data.file_name} <button type="button" className="badge bg-primary rounded-pill" onClick={()=>{downloadFile(data);}}>Download</button></li>
                                })
                            )
                        }
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}