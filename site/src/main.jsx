import React from 'react'
import ReactDOM from 'react-dom/client'
import { chargerDonnees } from './lib/donnees'
import RetourTesteur from './components/RetourTesteur'

const racine = ReactDOM.createRoot(document.getElementById('root'))

// Les données sont chargées avant le premier rendu : App.jsx lit ensuite
// des constantes déjà remplies, sans changer sa logique d'affichage.
chargerDonnees().then(async () => {
  const { default: App } = await import('./App.jsx')
  racine.render(
    <React.StrictMode>
      <App />
      {/* Bouton de retour testeur, monté à côté de l'application pour
          n'imposer aucune modification à App.jsx. */}
      <RetourTesteur application="site" />
    </React.StrictMode>
  )
})
