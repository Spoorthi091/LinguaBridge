# API Documentation — Language Translation Tool

Base URL (local development):
```
http://localhost:5000
```

---

## Endpoint: Translate Text

```
POST /translate
```

Translates a piece of text from a source language to a target language using LibreTranslate under the hood.

### Headers

| Header | Value | Required |
|---|---|---|
| `Content-Type` | `application/json` | Yes |

### Request Body

| Field | Type | Required | Description |
|---|---|---|---|
| `text` | string | Yes | The text to translate. Must be non-empty, max 5000 characters. |
| `source` | string | No | Source language code (e.g. `"en"`). Defaults to `"auto"` (auto-detect) if omitted. |
| `target` | string | Yes | Target language code (e.g. `"hi"`). |

#### Example Request

```json
POST /translate
Content-Type: application/json

{
  "text": "Hello, how are you?",
  "source": "en",
  "target": "hi"
}
```

---

### Success Response — `200 OK`

```json
{
  "success": true,
  "translatedText": "नमस्ते, आप कैसे हैं?"
}
```

---

### Error Responses

All error responses follow the same shape:

```json
{
  "success": false,
  "message": "Human-readable explanation of what went wrong"
}
```

| Status Code | Meaning | Example Cause |
|---|---|---|
| `400 Bad Request` | Invalid input | Empty `text`, missing `target`, `source` equals `target`, text exceeds 5000 characters |
| `400 / 502` | Provider rejected the request | Invalid language code, LibreTranslate returned a 4xx |
| `502 Bad Gateway` | Upstream provider error | LibreTranslate returned an empty or malformed response |
| `504 Gateway Timeout` | Upstream unreachable | LibreTranslate did not respond within 10 seconds, or is unreachable |
| `500 Internal Server Error` | Unexpected server error | Uncaught exception in the backend |

#### Example Error — Empty text

```json
{
  "success": false,
  "message": "Field 'text' is required and must be a non-empty string."
}
```

#### Example Error — Same source and target

```json
{
  "success": false,
  "message": "Source and target languages cannot be the same."
}
```

#### Example Error — Provider unreachable

```json
{
  "success": false,
  "message": "Could not reach the translation provider. Please try again shortly."
}
```

---

## Endpoint: Health Check

```
GET /
```

Returns a simple status payload, useful for uptime checks and deployment platforms (e.g. Render, Railway) that ping the root route.

#### Example Response — `200 OK`

```json
{
  "status": "ok",
  "message": "LinguaBridge Translation API is running."
}
```

---

## Notes

- CORS is enabled and restricted to the origins listed in the `CORS_ORIGIN` environment variable (see `.env.example`).
- The API is stateless — no authentication, sessions, or database are involved in this version.
- Rate limits are governed by whichever LibreTranslate instance is configured via `LIBRETRANSLATE_URL`.
