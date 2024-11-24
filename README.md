# MiniURL API

This simple service allows you to quickly turn long URLs into short, shareable links. Easy to use and straightforward!

## Techologies Used

- **Node.js**

- **Typescript**

## Base URL

All API requests should be made to: `https://sulm.vercel.app`

## Error Handling

The API uses standardized error responses to ensure consistent communication of issues. Errors are returned with appropriate HTTP status codes and a detailed error message.

**Error Response Format**:

```json
{
  "error": "A description of the error.",
  "stack": "The error's stack trace (only available if NODE_ENV is set to development)"
}
```

**Common Error Codes**:

| Status Code | Message                           |
| ----------- | --------------------------------- |
| 400         | The request data is invalid       |
| 404         | The requested resource is missing |
| 500         | An unexpected error occurred      |

## Rate Limiting

To ensure fair usage and maintain API performance, rate limiting is enforced on the URL shortening and search endpoints. The default rate limit for both endpoints is 50 requests per minute.

If you exceed the limit, the API responds with a 429 Too Many Requests status code.

**Rate Limit Error Response**:

```json
{
  "error": "You have exceeded the maximum number of allowed requests. Please try again later."
}
```

You can monitor your usage via the X-RateLimit-\* headers included in every response:

- `X-RateLimit-Limit`: Maximum allowed requests in the current window.
- `X-RateLimit-Remaining`: Number of requests remaining.
- `X-RateLimit-Reset`: Time (in seconds) until the rate limit resets.

## Endpoints

### 1. Shorten a URL

Shortens a provided URL.

**Endpoint**:

**POST** `/`

**Body Parameters:**
| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `url` | String | Yes | The URL to be shortened. |

**Response Format:**

```ts
{
  url_id: string;
  short_url: string;
}
```

### 2. Route to URL

Redirect to destination URL based on URL ID.

**Endpoint**:

**GET** `/:id`

**Path Parameters:**
| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `id` | String | Yes | The URL ID of the record. |

### 3. Find URL Record

Fetches a URL Record based on URL ID.

**Endpoint**:

**GET** `/:id/find`

**Path Parameters:**
| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `id` | String | Yes | The URL ID of the record. |

**Response Format:**

```ts
{
  url_id: string;
  destination_url: string;
}
```
