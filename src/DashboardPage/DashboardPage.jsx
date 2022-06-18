import './DashboardPage.css'
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import ListObject from "./ListObject/ListObject";

const DashboardPage = () => {
    let navigation = useNavigate()
    const [lists, setLists] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem('token')
        fetch('https://localhost/api/user/GetUserInfo', {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(res => {
            if (res.ok) {
                return res.json()
            } else {
                navigation('/login')
            }
        }).then(res => {
            let lists = res.lists.map(list => {
                return list
            })
            setLists(lists)
        })
    }, [navigation])
    return (
        <div className='DashboardPage'>
            {lists.map(list => (<ListObject key={list.listId} id={list.listId} name={list.listName}/>))}
        </div>
    )

}

export default DashboardPage