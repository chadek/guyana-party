import 'cookieconsent/build/cookieconsent.min.css'

if (typeof window !== 'undefined') {
  // Import non server side rendering cookieconsent
  import('cookieconsent').then(() => {
    window.cookieconsent.initialise({
      palette: {
        popup: { background: '#fff' },
        button: { background: '#3f51b5' }
      },
      theme: 'edgeless',
      position: 'bottom-left',
      content: {
        message:
          "Nous utilisons des cookies afin d'améliorer votre expérience sur le site et ainsi vous proposer un contenu adapté.",
        link: 'En savoir plus',
        href: '/mentions-legales/#cookies',
        dismiss: 'OK'
      }
    })
  })
}
