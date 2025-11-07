# API Documentation

## Endpoints

### Authentication

#### `GET /api/auth/github`

Initie le flux OAuth avec GitHub.

**Response:** Redirige vers la page d'autorisation GitHub

---

#### `GET /api/auth/github/callback`

Callback OAuth GitHub. Traite le code d'autorisation et crée/met à jour l'utilisateur.

**Query Parameters:**
- `code` (string, required): Code d'autorisation GitHub

**Response:** Redirige vers la page d'accueil avec `?success=true` ou `?error=message`

**Side Effects:**
- Crée ou met à jour l'utilisateur dans la base de données
- Récupère les contributions GitHub de l'année écoulée
- Définit un cookie de session

---

### Users

#### `GET /api/users`

Récupère la liste de tous les utilisateurs triés par nombre de contributions (décroissant).

**Response:**
```json
[
  {
    "id": "uuid",
    "github_username": "string",
    "github_id": "string",
    "display_username": "string | null",
    "website_url": "string | null",
    "avatar_url": "string",
    "total_contributions": 0,
    "contributions_data": {
      "2024-01-01": 5,
      "2024-01-02": 3,
      ...
    },
    "last_updated": "timestamp",
    "created_at": "timestamp"
  }
]
```

---

#### `PATCH /api/users/[githubId]`

Met à jour le profil d'un utilisateur.

**Path Parameters:**
- `githubId` (string): L'ID GitHub de l'utilisateur

**Request Body:**
```json
{
  "display_username": "string",
  "website_url": "string"
}
```

**Response:**
```json
{
  "id": "uuid",
  "github_username": "string",
  "github_id": "string",
  "display_username": "string",
  "website_url": "string",
  "avatar_url": "string",
  "total_contributions": 0,
  "contributions_data": {...},
  "last_updated": "timestamp",
  "created_at": "timestamp"
}
```

---

#### `GET /api/me`

Récupère l'utilisateur actuellement connecté basé sur le cookie de session.

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "github_username": "string",
    "github_id": "string",
    "display_username": "string | null",
    "website_url": "string | null",
    "avatar_url": "string",
    "total_contributions": 0,
    "contributions_data": {...},
    "last_updated": "timestamp",
    "created_at": "timestamp"
  }
}
```

Si non connecté:
```json
{
  "user": null
}
```

---

## Types

### User

```typescript
interface User {
  id: string
  github_username: string
  github_id: string
  display_username?: string
  website_url?: string
  avatar_url?: string
  total_contributions: number
  contributions_data?: ContributionData
  last_updated: string
  created_at: string
}
```

### ContributionData

```typescript
interface ContributionData {
  [date: string]: number // date in format "YYYY-MM-DD" => number of contributions
}
```

---

## Rate Limits

L'API GitHub a des limites de taux:
- **Authentifié**: 5,000 requêtes par heure
- **GraphQL**: 5,000 points par heure

L'application utilise l'API GraphQL GitHub pour récupérer les contributions, ce qui compte pour environ 1 point par requête.

---

## Error Handling

Tous les endpoints retournent des erreurs au format JSON:

```json
{
  "error": "Error message"
}
```

Codes de statut HTTP courants:
- `200`: Succès
- `400`: Requête invalide
- `401`: Non autorisé
- `404`: Ressource non trouvée
- `500`: Erreur serveur

---

## Cookies

### `github_username`

Cookie HTTP-only défini après une authentification réussie.

**Properties:**
- `httpOnly`: true
- `secure`: true (en production)
- `sameSite`: 'lax'
- `maxAge`: 2592000 (30 jours)

Ce cookie est utilisé pour identifier l'utilisateur actuel et lui permettre d'éditer son profil.


