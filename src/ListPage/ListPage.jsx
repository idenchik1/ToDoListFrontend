import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import './ListPage.css';
import {Button, Form, FormCheck} from 'react-bootstrap';

const ListPage = () => {
    let {id} = useParams()
    let navigation = useNavigate()
    const [tasks, setTasks] = useState([])
    const [changedTask, setChangedTask] = useState([])
    const [tasksUpdate, setTasksUpdate] = useState(0)
    const onStatusChange = (e) => {
        let taskId = e.target.id
        let tasksNew = tasks.map(task => {
            return task.taskId === parseInt(taskId) ? {...task, taskStatus: !task.taskStatus} : {...task}
        })
        setTasks(tasksNew)
        const token = localStorage.getItem('token')
        fetch('https://diplom.idenchik.tk/api/user/ChangeTaskStatus/' + taskId, {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(() => {
            /* ignore */
        })
    }

    const onContentChange = (e) => {
        let taskId = e.target.id
        if (taskId === "") {
            setChangedTask([taskId, e.target.value])
            return
        }
        let tasksNew = tasks.map(task => {
            if (task.taskId === parseInt(taskId)) {
                setChangedTask([taskId, e.target.value])
                return {...task, taskContent: e.target.value}
            } else {
                return {...task}
            }
        })
        setTasks(tasksNew)
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        fetch('https://diplom.idenchik.tk/api/user/GetTasks/' + id, {
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
            let tasks = res.map(task => task)
            setTasks(tasks)
        })
    }, [id, navigation, tasksUpdate])

    const onUnfocused = (e) => {
        if (changedTask.length === 2) {
            const token = localStorage.getItem('token')
            if (changedTask[0] === "") {
                if (changedTask[1].length >= 4) {
                    fetch('https://diplom.idenchik.tk/api/user/CreateTask/' + id, {
                        method: 'post',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({taskContent: changedTask[1]})
                    }).then(() => {
                        setTasksUpdate(tasksUpdate + 1)
                        setChangedTask([])
                        e.target.value = ''
                    })
                    return
                } else {
                    e.target.value = ''
                }
            }
            if (changedTask[1].length === 0) {
                fetch('https://diplom.idenchik.tk/api/user/DeleteTask/' + changedTask[0], {
                    method: 'delete',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                }).then(() => {
                    setTasksUpdate(tasksUpdate + 1)
                    setChangedTask([])
                })
                return
            }
            if (changedTask[1].length >= 4 && changedTask[1].length <= 256) {
                fetch('https://diplom.idenchik.tk/api/user/EditTask/' + changedTask[0], {
                    method: 'put',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({taskContent: changedTask[1]})
                }).then(() => {
                    setTasksUpdate(tasksUpdate + 1)
                    setChangedTask([])
                })
                return
            }
            setTasksUpdate(tasksUpdate + 1)
        }
        setChangedTask([])
    }

    const moveBack = () => {
        navigation('/list')
    }

    return (
        <div className='list-page'>
            <header className='list-header'>
                <img src={require('../logo.png')} alt='logo'/>
                <Button id="move-button" variant="primary" onClick={moveBack}>Back</Button>
            </header>
            {tasks.map(task => {
                return (
                    <div className='task' key={task.taskId}>
                        <Form.Control type="text" id={task.taskId} placeholder="Enter task"
                                      value={task.taskContent} onChange={onContentChange} onBlur={onUnfocused}/>
                        <FormCheck type='switch' id={task.taskId} className='task-status' checked={task.taskStatus}
                                   onChange={onStatusChange}/>
                    </div>
                )
            })}
            <div className='task'>
                <Form.Control type="text" placeholder="Enter task" onChange={onContentChange} onBlur={onUnfocused}/>
            </div>
        </div>
    )
}

export default ListPage