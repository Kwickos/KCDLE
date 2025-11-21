# 🟦 KCDLE - Karmine Corp Wordle

Bienvenue sur **KCDLE**, un jeu inspiré de Wordle et Loldle, dédié aux fans de la **Karmine Corp** ! Testez vos connaissances sur les joueurs, le staff et les légendes du Blue Wall.

![KCDLE Banner](https://via.placeholder.com/800x200?text=KCDLE+Banner)

## 🎮 Modes de Jeu

### 1. Classic Mode
Devinez le membre de la Karmine Corp du jour !
- **Indices** : Rôle, Jeu, Ligue, Nationalité, Année d'arrivée, Statut.
- **Code couleur** :
  - 🟩 **Vert** : Correspondance exacte.
  - 🟧 **Orange** : Partiellement correct (ex: même jeu mais mauvais rôle).
  - 🟥 **Rouge** : Incorrect.

### 2. Loldle Mode (Bientôt)
Devinez le membre à partir d'indices visuels ou textuels :
- **Image floutée** : Reconnaissez le joueur.
- **Citation** : Qui a dit ça ?

## 🛠️ Stack Technique

Ce projet est construit avec des technologies modernes pour assurer performance et maintenabilité :

- **Frontend** : [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool** : [Vite](https://vitejs.dev/)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/)
- **Backend / Database** : [Supabase](https://supabase.com/)
- **Routing** : [React Router](https://reactrouter.com/)

## 🚀 Installation et Lancement

Pour lancer le projet localement, suivez ces étapes :

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/Kwickos/KCDLE.git
   cd KCDLE
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   Créez un fichier `.env` à la racine du projet et ajoutez vos clés Supabase :
   ```env
   VITE_SUPABASE_URL=votre_url_supabase
   VITE_SUPABASE_ANON_KEY=votre_cle_anon_supabase
   ```

4. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

## 👑 Backoffice & Contribution

Le jeu dispose d'un **Backoffice** permettant de :
- Gérer la liste des membres (Ajout, Édition, Suppression).
- Modérer les suggestions de la communauté.

Les utilisateurs peuvent suggérer des modifications (ajout de nouveaux joueurs, corrections) directement depuis l'interface, qui seront ensuite validées par les administrateurs.

## 🤝 Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une **Issue** ou une **Pull Request** pour proposer des améliorations.

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

---
*Fait avec 💙 par le Blue Wall.*
