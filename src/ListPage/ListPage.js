import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import './ListPage.css'

const ListPage = () => {
    let {id} = useParams()
    let navigation = useNavigate()
    const [tasks, setTasks] = useState([])
    const onStatusChange = (e) => {
        let taskId = e.target.id
        let tasksNew = tasks.map(task => {
            return task.taskId === parseInt(taskId) ? {...task, taskStatus: !task.taskStatus} : {...task}
        })
        setTasks(tasksNew)
        const token = localStorage.getItem('token')
        fetch('https://localhost/api/user/ChangeTaskStatus/' + taskId, {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(() => {
            /* ignore */
        })
    }
    useEffect(() => {
        const token = localStorage.getItem('token')
        fetch('https://localhost/api/user/GetTasks/' + id, {
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
    }, [id, navigation])
    return (
        <div className='ListPage'>
            {tasks.map(task => {
                return (
                    <div className='task' key={task.taskId}>
                        <span className='SpanText'>{task.taskContent}</span>
                        <input type='checkbox' id={task.taskId} className='taskStatus' checked={task.taskStatus}
                               onChange={onStatusChange}/>
                    </div>
                )
            })}
        </div>
    )
}

export default ListPage