import React, {useEffect} from "react";
import './App.css'
import {BrowserRouter, Navigate, Route, Routes, useNavigate} from "react-router-dom";
import LoginPage from "./LoginPage/LoginPage";
import DashboardPage from "./DashboardPage/DashboardPage";
import ListPage from "./ListPage/ListPage";
import RegisterPage from "./RegisterPage/RegisterPage";

const ProtectedRoute = ({children}) => {
    let navigate = useNavigate()
    let token = localStorage.getItem('token')
    useEffect(() => {
        if (!token) {
            navigate('/login')
        }
    }, [navigate, token])
    fetch('https://backend/api/user/IsAuthed', {
        method: 'get',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(res => {
        if (!res.ok) {
            localStorage.removeItem('token')
            navigate('/login')
            return
        }
    })

    return children;
};

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Navigate to={'/dashboard'}/>}/>
                    <Route index path='/dashboard' element={<ProtectedRoute>
                        <DashboardPage/>
                    </ProtectedRoute>}/>
                    <Route path='/login' element={<LoginPage/>}/>
                    <Route path='/register' element={<RegisterPage/>}/>
                    <Route path='/list/:id' element={<ProtectedRoute>
                        <ListPage/>
                    </ProtectedRoute>}/>
                    <Route path='*' exact={true} element={<Navigate to={'/dashboard'}/>} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
