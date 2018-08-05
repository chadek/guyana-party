function subscriptions (freeSubsBtn, assoSubsBtn) {
  if (!freeSubsBtn || !assoSubsBtn) return
  freeSubsBtn.on('click', () => (window.location.href = '/souscriptions/free'))
  assoSubsBtn.on(
    'click',
    () => (window.location.href = '/souscriptions/payment/asso')
  )
}

export default subscriptions
