import React from 'react'
import { useRoutes } from 'react-router-dom'
import Navigation from './components/Navigation'
import ViewCars from './pages/ViewCars'
import EditCar from './pages/EditCar'
import CreateCar from './pages/CreateCar'
import CarDetails from './pages/CarDetails'
import './App.css'

const App = () => {
  let element = useRoutes([
    {
      path: '/',
      element: <ViewCars title='BOLT BUCKET | View Cars' />
    },
    {
      path:'/cars',
      element: <ViewCars title='BOLT BUCKET | View Cars' />
    },
    {
      path: '/cars/:id',
      element: <CarDetails title='BOLT BUCKET | Car Details' />
    },
    {
      path: '/cars/:id/edit',
      element: <EditCar title='BOLT BUCKET | Edit Car' />
    },
    {
      path: '/create',
      element: <CreateCar title='BOLT BUCKET | Customize' />
    }
  ])

  return (
    <div className='app'>

      <Navigation />

      { element }

    </div>
  )
}

export default App