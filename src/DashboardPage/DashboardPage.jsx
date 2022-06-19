import './DashboardPage.css'
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Badge, Button, CloseButton, Form} from "react-bootstrap";

const DashboardPage = () => {
    let navigation = useNavigate()
    const [lists, setLists] = useState([]);
    const [newList, setNewList] = useState('');
    const [listsUpdate, setListsUpdate] = useState(0);
    useEffect(() => {
        const token = localStorage.getItem('token')
        fetch('https://diplom.idenchik.tk/api/user/GetUserInfo', {
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
    }, [navigation, listsUpdate])

    const onContentChange = (e) => {
        setNewList(e.target.value)
    }

    const onUnfocused = (e) => {
        if (newList.length >= 4 && newList.length <= 64) {
            const token = localStorage.getItem('token')
            fetch('https://diplom.idenchik.tk/api/user/CreateList/', {
                method: 'post',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({listName: newList})
            }).then(() => {
                setListsUpdate(listsUpdate + 1)
            })
        }
        setNewList('')
    }

    const deleteList = (e) => {
        const listId = e.target.name
        const token = localStorage.getItem('token')
        fetch('https://diplom.idenchik.tk/api/user/DeleteList/' + listId, {
            method: 'delete',
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        }).then(() => {
            setListsUpdate(listsUpdate + 1)
        })
    }

    const exit = () => {
        localStorage.removeItem('token')
        navigation('/login')
    }

    return (
        <div className='dashboard-page'>
            <header className='list-header'>
                <img src={require('../logo.png')} alt='logo'/>
                <Button id='exit-button' variant='danger' onClick={exit}>Exit</Button>
            </header>
            {lists.map(list => {
                return (
                    <div key={list.listId} className='list-object'>
                        <Link to={'/list/' + list.listId}>
                            <Badge className='badge' pill bg="primary">{list.listName}</Badge>
                        </Link>
                        <CloseButton id='delete-button' name={list.listId} onClick={deleteList}/>
                    </div>
                )
            })}
            <div className='task'>
                <Form.Control type="text" placeholder="Enter list name" onChange={onContentChange} value={newList}
                              onBlur={onUnfocused}/>
            </div>
        </div>
    )

}

export default DashboardPage