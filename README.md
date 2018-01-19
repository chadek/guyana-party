# Guyana-party

Site d'évènement en Guyane

## Installation
Prérequis:
  * Installer node js
  * Installer le Node Packaged Module (npm)
  * Télécharger toute les dépendances à l'aide de npm (lancer npm install à l'emplacement du fichier package.json)
  * Installer MongoDB et démarrer le service (sudo service mongod start)

  Pour démarrer l'application en mode développement exécuter l'instruction suivante à partir du dossier principal: DEBUG=guyana-party:* npm start

  L'application est accessible à partir du port 3000 (http://localhost:3000)
  MongoDB est accessible à partir du port 27017
  Pour visualiser le contenu de la base de données, démarrer mongo et entrer les lignes de commandes voulus. Quelques commandes utiles :
  * use mybdName
  * db.createCollection("collectionName")
  * db.user.insert({ fieldName: 'someValue', otherFieldName: 13566 })
  * db.user.find().pretty()


## Architecture

### MVC (Model Vue Controleur)

L'application est construite suivant le modèle MVC:

* **Controleur** : app.js incluant les routes (/routes) il traite les requêtes et fait le lien entre les vues et la base de donnée
* **Modèle** : Base de données NoSQL constitué de deux entitées : **user** et **event**.
* **Vues** : Partie visible de l'application (/views). Elles sont rendues par le contrôleur à partir d'informations extraite de la base de donnée.

Les script js et les CSS chargés par les vues sont présent dans /public

Chaque vu contenant une map à un script js qui lui est associé (/public/js/ol)

### Gestion d'utilisateur

Authentification et enregistrement d'utilisateur gérer par le module **passport** (/Utils/auth.js) TODO vérification d'email par XXXXXX.

Une fois authentifier on produit un cookie que l'utilisateur transmet pour chaque nouvelle requête lui permettant d'accéder au parties à accès restreint.

### Vues

#### Partial

Définis des éléments partiels intégrés à plusieurs vues : bandeau, menu latéral

#### evenement.ejs

Affiche un évènement de la base de données avec tout les détails le concernant

#### evenement_mult.ejs

Affiche tout les événements de la base sur une carte sous forme de points (TODO de couleur différente en fonction de leur type).  

#### creation_evenement.ejs

Page de création d'événement. Date et heure initialisé avec la date du jour. Adresse rempli automatiquement après un click sur la carte. Possibilité d'uploader une image (flyer). Ajout d'une description.

TODO traitement de l'image pour gérer format taille etc...  
Script de validation des données avant envoie (date, heure, titre)

#### index.ejs

Page d'accueil (A définir)

#### inscription.ejs

Page d'inscription/authentification de l'utilisateur.

TODO script de vérification des données avant envoie (mdp egaux, email inexistant, user inexistant)

#### recherche.ejs

Fusionner avec evenement_mult.ejs ?

#### organisme.ejs

Inutilisé pour l'instant

#### suppr_evenement.ejs

Page de confirmation de suppression d'une évènement

#### error.ejs

Affiche le code, le type et la trace de l'erreur relevé

### Modèle

**Objets :**
* user:
- user
- email
- password
- type

* event:
- user
- name
- date
- heure
- longitude
- latitude
- address
- description
- flyer (id du fichier stocké dans la bd)

### Routes

index.js gère les routes sans préfixe
event.js gère les routes avec le préfixe evenement
users.js gère les routes avec le préfixe users



English version:

Website for events in Guyana

Prerequistes:
 * NodeJS
 * npm
 * mongodb

Usage:
 * npm install
 * launch mongodb
 * DEBUG=guyana-party:* npm start
 * go to 127.0.0.1:3000
