function subscriptions(freeSubsBtn, assoSubsBtn) {
  if (!freeSubsBtn || !assoSubsBtn) return;
  freeSubsBtn.on("click", () => (location.href = "/souscriptions/free"));
  assoSubsBtn.on("click", () => (location.href = "/souscriptions/payment/asso"));
}

export default subscriptions;
