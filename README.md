# MiniURL API

## Overview

This simple service allows you to quickly turn long URLs into short, shareable links. Easy to use and straightforward!

## Techologies Used

- **Node.js**

- **Typescript**

<!-- ## Base URL

All API requests should be made to: `https://m-jn9z.onrender.com` -->

## Endpoints

### 1. Shorten a URL

Shortens a provided URL.

- **URL:** `/`
- **Method:** `POST`
- **Body Parameters:**
  - `url` (string, required): The URL to be shortened.

**Response:**

- Success: A short URL that leads to the provided URL
- Error: Error message
