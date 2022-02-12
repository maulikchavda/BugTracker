import React, { useState, useEffect } from 'react'
import { Route } from 'react-router-dom'
import LogEditScreen from './LogEditScreen'
import LogsScreen from './LogsScreen'
import LogSolution from './LogSolution'
import RegisterScreen from './RegisterScreen'
import LoginScreen from './LoginScreen'
import MyLogsScreen from './MyLogsScreen'
const App = () => {
  return (
    <>
      <Route path='/' component={LoginScreen} exact />
      <Route path='/register' component={RegisterScreen} />
      <Route path='/logs' component={LogsScreen} exact />
      <Route path='/mylogs' component={MyLogsScreen} exact />
      <Route
        path={`/logs/:id/edit`}
        render={({ history }) => <LogEditScreen history={history} />}
        exact
      />
      <Route
        path={`/logs/:id/solution`}
        render={({ history }) => <LogSolution history={history} />}
        exact
      />
    </>
  )
}

export default App
