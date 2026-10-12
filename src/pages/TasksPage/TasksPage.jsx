import {TasksProvider} from '@/entities/todo'
import Todo from '@/widgets/Todo'

const TasksPages = () => {
    return (
        <TasksProvider>
            <Todo />
        </TasksProvider>
    )
}

export default TasksPages
