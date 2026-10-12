import Router from "@/app/routing/Router"
import TasksPage from "@/pages/TasksPage"
import TaskPage from "@/pages/TaskPage"
import './styles'

const App = () => {
  const routes = {
    '/': TasksPage,
    '/tasks/:id': TaskPage,
    '*': () => <div>404 PAge not f0und</div>,
  }

  return (
    <Router routes={routes} />
  )
}

export default App
