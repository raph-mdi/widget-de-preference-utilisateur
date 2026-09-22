# widget de preference utilisateur

## 1. Objectifs pedagogiques

L'exercice permet de comprendre comment :

- creer un cookie avec une duree de vie ;
- lire une valeur en parcourant `document.cookie` ;
- modifier un cookie en le redeclarant avec le meme nom ;
- supprimer un cookie avec `max-age=0` ;
- limiter un cookie a un chemin avec `path=/` ;
- conserver une preference entre deux chargements de page ;
- relier des evenements utilisateur a une modification de cookie ;
- distinguer une preference acceptee d'une preference refusee ;
- incrementer une valeur stockee sous forme de texte.

## 2. Comprendre `document.cookie`

`document.cookie` represente les cookies accessibles depuis la page courante sous la forme d'une chaine de caracteres :

```js
theme=dark; consent=true; visits=4
```

Chaque cookie est separe par `; `. Les cookies sont toujours lus comme du texte, meme lorsque leur valeur represente un nombre ou un booleen.

L'affectation suivante cree ou modifie un cookie :

```js
document.cookie = "theme=dark; path=/";
```

Cette instruction ne remplace pas tous les cookies existants. Elle agit uniquement sur le cookie dont le nom est indique dans la chaine.

## 3. Le cycle de vie d'un cookie

### Creation

Un cookie est cree en fournissant au minimum un nom et une valeur :

```js
document.cookie = "consent=true; path=/";
```

Dans le projet, `consent`, `theme` et `visits` sont les trois cookies utilises.

### Lecture

La fonction `getCookie` separe la chaine de cookies et recherche le nom demande :

```js
function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const found = cookies.find(cookie => cookie.startsWith(name + "="));
  return found ? found.split("=")[1] : null;
}
```

Retourner `null` lorsqu'un cookie n'existe pas permet ensuite de distinguer une premiere visite d'une visite deja connue.

### Modification

Il n'existe pas de methode `updateCookie`. Pour modifier un cookie, il faut le redeclarer avec le meme nom et de nouvelles options :

```js
document.cookie = `visits=${newValue}; max-age=31536000; path=/`;
```

Le navigateur remplace alors l'ancienne valeur, a condition que le nom et le chemin correspondent.

### Suppression

Un cookie est supprime en le redeclarant avec une duree nulle :

```js
document.cookie = "theme=; max-age=0; path=/";
```

Le `path` doit correspondre a celui utilise lors de la creation. Il est donc important de conserver `path=/` aussi lors de la suppression.

## 4. Duree de vie et portee

### `max-age`

`max-age` exprime une duree en secondes a partir de maintenant :

```js
document.cookie = "consent=true; max-age=15778800; path=/";
```

Ici, le consentement est conserve pendant environ six mois.

### `expires`

`expires` utilise une date d'expiration precise. Cette syntaxe est utile pour comprendre la difference entre une duree calculee et une date deja determinee :

```js
const expiration = new Date();
expiration.setTime(expiration.getTime() + 15778800 * 1000);
document.cookie = `theme=dark; expires=${expiration.toUTCString()}; path=/`;
```

Le projet utilise `expires` pour le theme et `max-age` pour les autres cookies afin de pratiquer les deux formes.

### `path`

`path=/` rend le cookie disponible sur toutes les pages du site. Sans cette option, le navigateur peut limiter le cookie au chemin courant, ce qui compliquerait sa lecture depuis une autre page.

## 5. Fonctionnement des fonctionnalites

### Bandeau de consentement

Au chargement, le script verifie uniquement l'existence du cookie `consent` :

```js
if (!getCookie("consent")) {
  banniere.style.display = "block";
} else {
  banniere.style.display = "none";
}
```

Les deux choix enregistrent des valeurs differentes :

- `consent=true` apres acceptation, avec une duree longue ;
- `consent=false` apres refus, avec une duree plus courte afin de pouvoir redemander le choix plus souvent.

Le test porte sur l'existence du cookie, et non sur la valeur `true`. Ainsi, un refus enregistre reste bien un choix deja formule pendant sa periode de validite.

### Switch de theme

Le bouton alterne entre deux etats :

- le texte du bouton indique l'action disponible ;
- la classe CSS indique le style du bouton ;
- le cookie `theme` memorise le choix.

Une implementation complete doit aussi lire `theme` au chargement et appliquer la classe correspondante au `body`. Le cookie ne change pas automatiquement l'apparence : JavaScript doit lire la valeur puis modifier le DOM ou les classes CSS.

Exemple de logique d'initialisation :

```js
const theme = getCookie("theme");

if (theme === "dark") {
  document.body.classList.add("theme-dark");
}
```

### Compteur de visites

Le compteur suit quatre etapes :

1. lire `visits` ;
2. convertir le texte en nombre avec `Number` ;
3. ajouter `1` ;
4. reecrire la nouvelle valeur dans le cookie.

```js
let visits = Number(getCookie("visits")) || 0;
visits += 1;
document.cookie = `visits=${visits}; max-age=31536000; path=/`;
```

L'operateur `|| 0` fournit une valeur de depart lorsque le cookie est absent ou invalide. La valeur affichee dans le HTML est ensuite mise a jour avec `textContent`.

### Reinitialisation

Le bouton de reinitialisation supprime les trois cookies :

```js
const cookieNames = ["consent", "theme", "visits"];

cookieNames.forEach(name => {
  document.cookie = `${name}=; max-age=0; path=/`;
});
```

Apres cette action, l'interface peut etre actualisee ou remise dans son etat initial afin de rendre le changement visible immediatement.

## 6. Role des fichiers

- `index.html` definit la structure, les boutons, le bandeau et les identifiants utilises par JavaScript ;
- `style.css` definit la presentation, les classes de boutons et les adaptations mobiles ;
- `script.js` gere les evenements et le cycle de vie des cookies ;
- `README.md` presente le sujet et les fonctionnalites attendues ;
- `README.md` explique les notions et les choix techniques de l'exercice.

Les identifiants HTML doivent correspondre exactement aux appels `getElementById`. Une faute de frappe, comme un identifiant different entre HTML et JavaScript, empeche l'ecouteur d'evenement de fonctionner.

## 7. Points de vigilance

- `document.cookie` ne renvoie pas les cookies marques `HttpOnly` ;
- les valeurs doivent etre encodees si elles contiennent des caracteres speciaux ;
- les cookies ne sont pas un stockage adapte a de grandes quantites de donnees ;
- un cookie client peut etre modifie par l'utilisateur et ne doit pas servir a proteger une information sensible ;
- `Secure` et `SameSite` sont importants dans une application reelle, mais ne sont pas l'objectif principal de cet exercice local ;
- un cookie expire ou supprime ne disparait pas necessairement d'une variable JavaScript deja chargee : l'interface doit etre resynchronisee ;
- les cookies poses en local peuvent se comporter differemment selon que la page est ouverte directement depuis le systeme de fichiers ou servie par un serveur web.

## 8. Checklist de validation

- [ ] Le bandeau apparait lorsque `consent` est absent.
- [ ] Le bouton Accepter cree `consent=true`.
- [ ] Le bouton Refuser cree `consent=false`.
- [ ] Le choix du theme est conserve apres rechargement.
- [ ] Le theme est applique au chargement a partir du cookie.
- [ ] Le compteur augmente d'une unite a chaque chargement.
- [ ] Les cookies sont visibles dans `document.cookie`.
- [ ] La reinitialisation supprime `consent`, `theme` et `visits`.
- [ ] Le bandeau reapparait apres une reinitialisation et un rechargement.

## Conclusion

Ce mini-projet met en pratique le fait qu'un cookie est une petite donnee persistante, lue et modifiee explicitement par le code. La competence centrale n'est pas seulement de memoriser une valeur, mais de relier correctement son cycle de vie au comportement de l'interface : lire au chargement, ecrire lors d'une action, afficher l'etat correspondant et supprimer proprement la preference lorsque l'utilisateur le demande.
