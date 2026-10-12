// внутри нам надо хранить текущий путь, следить за изменениями этого путя
// и рендерить компонент, который соответсвует этому пути

import { useEffect, useState } from "react"

const getCurrentPath = () => {
    const pathname = window.location.pathname

    return pathname.startsWith(BASE_URL)
        ? pathname.slice(BASE_URL/length - 1) || '/'
        : pathname
}

const matchPath = (path, route) => {
    const pathParts = path.split('/')     // '/tasks/123' => ['', 'tasks', '123']
    const routePaths = route.split('/')   // '/tasks/:id' => ['', 'tasks', ':id']

    if (pathParts.length !== routePaths.length) {
        return null
    }

    const params = {}

    for (let i = 0; i < routePaths.length; i++) {
        if (routePaths[i].startsWith(':')) {
            const paramName = routePaths[i].slice(1)

            params[paramName] = pathParts[i]
        } else if (routePaths[i] !== pathParts[i]) {
            return null
        }
    }
    // если ни один return не выполнился значит все совпало и мы вернем объект с параметрами

    return params
}

export const useRoute = () => {
    const [path, setPath] = useState(getCurrentPath()) // чтобы хранить в состоянии текущий путь

    useEffect(() => {
        const onLocationChange = () => {
            setPath(getCurrentPath())
        }

        window.addEventListener('popstate', onLocationChange)

        return () => {
            window.removeEventListener('popstate', onLocationChange)
        }
    }, [])

    return path      // для понимания на каком url адресе мы сейчас находимся
}

const Router = (props) => {
    const { routes } = props
    const path = useRoute()

    for (const route in routes) {
        const params = matchPath(path, route)

        if (params) {
            const Page = routes[route]

            return <Page params={params} />
        }
    }

    const NotFound = routes['*']

    return <NotFound />
}

export default Router
