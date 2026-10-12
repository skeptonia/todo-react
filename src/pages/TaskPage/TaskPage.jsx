import { useState, useEffect } from "react"
import tasksAPI from "@/shared/API/tasks"

const TaskPage = (props) => {
    const { params } = props
    const taskId = params.id

    const [task, setTask] = useState(null)   // хранит данные о конкретной текущей задаче
    const [isLoading, setIsLoading] = useState(true)   // для статуса загрузки (статус загрузки по умолчанию активен, сервер сходу загружает компонент)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        tasksAPI.getById(taskId).then((taskData) => {
            setTask(taskData)
            setHasError(false)
        })
        .catch(() => {
            setHasError(true)
        })
        .finally(() => {
            setIsLoading(false)
        })
    }, [])

    if (isLoading) {  // если ИСТИНА или Запрос еще не свершился
        return <div>Loading...</div>
    }

    if (hasError) {
        return <div>Task not found</div>
    }

    return (
        <div>
            <h1>{task.title}</h1>
            <p>{task.isDone ? 'Задача выполнена' : 'Задача не выполнена'}</p>
        </div>
    )
}

export default TaskPage