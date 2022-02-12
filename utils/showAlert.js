function showAlert (setAlert, message, variant = 'danger', seconds = 3000) {
  setAlert({
    show: true,
    message,
    variant
  })
  setTimeout(() => {
    setAlert({
      show: false,
      message: '',
      variant: 'danger'
    })
  }, seconds)
}

module.exports = showAlert
