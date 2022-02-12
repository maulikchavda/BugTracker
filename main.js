const path = require('path')
const url = require('url')
var fs = require('fs')
var FormData = require('form-data')
const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const connectDB = require('./config/db')
const axios = require('axios')
require('./app')

// Connect to Database
connectDB()
const proxyServer = 'http://localhost:5000'

let mainWindow

let isDev = false
const isMac = process.platform === 'darwin' ? true : false

if (
  process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV === 'development'
) {
  isDev = true
}

function createMainWindow () {
  mainWindow = new BrowserWindow({
    width: isDev ? 1600 : 1100,
    height: 800,
    show: false,
    backgroundColor: 'white',
    icon: './assets/icons/icon.png',
    resizable: isDev ? true : false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  let indexPath

  if (isDev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    })
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    })
  }

  mainWindow.loadURL(indexPath)

  // Don't show until we are ready and loaded
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()

    // Open devtools if dev
    if (isDev) {
      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS
      } = require('electron-devtools-installer')

      installExtension(REACT_DEVELOPER_TOOLS).catch(err =>
        console.log('Error loading React DevTools: ', err)
      )
      mainWindow.webContents.openDevTools()
    }
  })

  mainWindow.on('closed', () => (mainWindow = null))
}

app.on('ready', () => {
  createMainWindow()

  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)
})

const menu = [
  ...(isMac
    ? [
        {
          role: 'appMenu'
        }
      ]
    : []),
  {
    role: 'fileMenu'
  },
  {
    role: 'editMenu'
  },
  ...(isDev
    ? [
        {
          label: 'Developer',
          submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { role: 'separator' },
            { role: 'toggledevtools' }
          ]
        }
      ]
    : [])
]

ipcMain.on(
  'user:register',
  async (e, name, email, password, confirmPassword) => {
    try {
      const config = {
        headers: {
          'content-type': 'application/json'
        }
      }
      const { data } = await axios.post(
        `${proxyServer}/api/users`,
        { name, email, password, confirmPassword },
        config
      )
      mainWindow.webContents.send('userregister:info', data)
    } catch (error) {
      mainWindow.webContents.send('error:info', JSON.stringify(error))
    }
  }
)

ipcMain.on('user:login', async (e, email, password) => {
  try {
    const config = {
      headers: {
        'content-type': 'application/json'
      }
    }
    const { data } = await axios.post(
      `${proxyServer}/api/users/login`,
      { email, password },
      config
    )
    mainWindow.webContents.send('userlogin:info', data)
  } catch (error) {
    mainWindow.webContents.send('error:info', JSON.stringify(error))
  }
})

ipcMain.on('logs:load', sendLogs)

async function sendLogs () {
  try {
    const config = {
      headers: {
        'content-type': 'application/json'
      }
    }
    const { data } = await axios.get(`${proxyServer}/api/logs`, config)
    mainWindow.webContents.send('logs:get', JSON.stringify(data))
  } catch (error) {
    mainWindow.webContents.send('error:info', JSON.stringify(error))
  }
}

//Create Log
ipcMain.on('logs:add', async (e, item, userInfo) => {
  try {
    const config = {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }
    await axios.post(`${proxyServer}/api/logs`, item, config)
    sendLogs()
  } catch (error) {
    mainWindow.webContents.send('error:info', JSON.stringify(error))
  }
})

//Delete Log
ipcMain.on('logs:delete', async (e, id, userInfo) => {
  try {
    const config = {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }
    await axios.delete(`${proxyServer}/api/logs/${id}`, config)
    sendLogs()
    //Update Personal Logs as well
    const { data } = await axios.get(`${proxyServer}/api/logs/mylogs`, config)
    mainWindow.webContents.send('logs:getMy', JSON.stringify(data))
  } catch (error) {
    mainWindow.webContents.send('error:info', JSON.stringify(error))
  }
})

//Load Log
ipcMain.on('log:load', async (e, id, userInfo) => {
  try {
    const config = {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }
    const { data } = await axios.get(`${proxyServer}/api/logs/${id}`, config)
    mainWindow.webContents.send('log:get', JSON.stringify(data))
  } catch (error) {
    mainWindow.webContents.send('error:info', JSON.stringify(error))
  }
})

//Update Log
ipcMain.on('log:update', async (e, id, solution, solutionLink, userInfo) => {
  try {
    const config = {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }
    await axios.put(
      `${proxyServer}/api/logs/${id}`,
      { solution, solutionLink },
      config
    )
  } catch (error) {
    mainWindow.webContents.send('error:info', JSON.stringify(error))
  }
})

//Get Personal Logs
ipcMain.on('logs:mylogs', async (e, userInfo) => {
  try {
    const config = {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }
    const { data } = await axios.get(`${proxyServer}/api/logs/mylogs`, config)
    mainWindow.webContents.send('logs:getMy', JSON.stringify(data))
  } catch (error) {
    mainWindow.webContents.send('error:info', JSON.stringify(error))
  }
})

// Upload Image
ipcMain.on('image:upload', async (e, filePath) => {
  try {
    const form_data = getFormData(filePath)
    const formHeaders = form_data.getHeaders()
    const config = {
      headers: {
        ...formHeaders
      }
    }
    const { data } = await axios.post(
      `${proxyServer}/api/upload`,
      form_data,
      config
    )
    mainWindow.webContents.send('upload:getimages', JSON.stringify(data))
  } catch (error) {
    mainWindow.webContents.send('error:info', JSON.stringify(error))
  }
})

function getFormData (filePath) {
  const formData = new FormData()
  formData.append('image', fs.createReadStream(`${filePath}`))
  // Object.keys(object).forEach(key => formData.append(key, object[key]));
  return formData
}

// Clear all Logs
ipcMain.on('clear:logs', async (e, userInfo) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }
    await axios.delete(`${proxyServer}/api/logs`, config)
    sendLogs()
    mainWindow.webContents.send('logs:clear')
  } catch (error) {
    // console.log(error)
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow()
  }
})

// Stop error
// app.allowRendererProcessReuse = true
