# API Reference

This document provides a comprehensive reference for the WordWanderer API endpoints.

## Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://your-ngrok-url.ngrok.io`

## Authentication

WordWanderer uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": {}, // Response data
  "message": "Success message"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": {} // Additional error details (development only)
}
```

## Authentication Endpoints

### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "displayName": "Display Name",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "username": "username",
      "displayName": "Display Name",
      "totalXP": 0,
      "currentStreak": 0,
      "gems": 0
    },
    "token": "jwt_token_here"
  },
  "message": "User registered successfully"
}
```

### POST /api/auth/login

Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "username": "username",
      "displayName": "Display Name",
      "totalXP": 1250,
      "currentStreak": 5,
      "gems": 150
    },
    "token": "jwt_token_here"
  },
  "message": "Login successful"
}
```

### GET /api/auth/me

Get current user information (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "username": "username",
      "displayName": "Display Name",
      "totalXP": 1250,
      "currentStreak": 5,
      "longestStreak": 12,
      "gems": 150,
      "joinedAt": "2024-01-15T10:30:00Z",
      "lastActiveAt": "2024-01-20T14:45:00Z"
    }
  }
}
```

### POST /api/auth/logout

Logout user and invalidate token.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

## User Endpoints

### GET /api/users/profile

Get user profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "user_id",
      "username": "username",
      "displayName": "Display Name",
      "avatar": "avatar_url",
      "totalXP": 1250,
      "currentStreak": 5,
      "longestStreak": 12,
      "gems": 150,
      "level": 13,
      "achievements": [
        {
          "id": "first_lesson",
          "name": "First Steps",
          "description": "Complete your first lesson",
          "unlockedAt": "2024-01-15T11:00:00Z"
        }
      ],
      "courses": [
        {
          "courseId": "chinese_basics",
          "progress": 45,
          "completedLessons": 12,
          "totalLessons": 27,
          "enrolledAt": "2024-01-15T10:30:00Z"
        }
      ]
    }
  }
}
```

### PUT /api/users/profile

Update user profile information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "displayName": "New Display Name",
  "avatar": "new_avatar_url"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "displayName": "New Display Name",
      "avatar": "new_avatar_url"
    }
  },
  "message": "Profile updated successfully"
}
```

## Course Endpoints

### GET /api/courses

Get list of available courses.

**Response:**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "chinese_basics",
        "title": "Chinese for Beginners",
        "description": "Learn Mandarin Chinese from scratch",
        "language": {
          "code": "zh",
          "name": "Chinese",
          "nativeName": "中文",
          "flag": "🇨🇳"
        },
        "difficulty": "beginner",
        "estimatedHours": 40,
        "totalLessons": 27,
        "totalUnits": 5,
        "isEnrolled": false
      }
    ]
  }
}
```

### GET /api/courses/:courseId

Get detailed course information.

**Parameters:**
- `courseId` - Course identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "course": {
      "id": "chinese_basics",
      "title": "Chinese for Beginners",
      "description": "Learn Mandarin Chinese from scratch",
      "language": {
        "code": "zh",
        "name": "Chinese",
        "nativeName": "中文",
        "flag": "🇨🇳"
      },
      "units": [
        {
          "id": "unit_1",
          "title": "Basic Greetings",
          "description": "Learn essential greetings and introductions",
          "order": 1,
          "isUnlocked": true,
          "completedLessons": 3,
          "totalLessons": 5,
          "lessons": [
            {
              "id": "lesson_1",
              "title": "Hello and Goodbye",
              "type": "vocabulary",
              "difficulty": "easy",
              "xpReward": 10,
              "isCompleted": true,
              "isLocked": false,
              "order": 1
            }
          ]
        }
      ]
    }
  }
}
```

### POST /api/courses/:courseId/enroll

Enroll in a course.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `courseId` - Course identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "enrollment": {
      "courseId": "chinese_basics",
      "enrolledAt": "2024-01-20T15:30:00Z",
      "progress": 0
    }
  },
  "message": "Successfully enrolled in course"
}
```

## Lesson Endpoints

### GET /api/lessons/:lessonId

Get lesson content and questions.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `lessonId` - Lesson identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "lesson": {
      "id": "lesson_1",
      "title": "Hello and Goodbye",
      "description": "Learn basic greetings in Chinese",
      "type": "vocabulary",
      "difficulty": "easy",
      "xpReward": 10,
      "questions": [
        {
          "id": "q1",
          "type": "multiple_choice",
          "question": "How do you say 'Hello' in Chinese?",
          "options": ["你好", "再见", "谢谢", "不客气"],
          "correctAnswer": 0,
          "explanation": "你好 (nǐ hǎo) is the most common way to say hello in Chinese."
        }
      ]
    }
  }
}
```

### POST /api/lessons/:lessonId/submit

Submit lesson answers and get results.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `lessonId` - Lesson identifier

**Request Body:**
```json
{
  "answers": [
    {
      "questionId": "q1",
      "answer": 0
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "results": {
      "score": 100,
      "correctAnswers": 1,
      "totalQuestions": 1,
      "xpEarned": 10,
      "streakUpdated": true,
      "newStreak": 6,
      "questionResults": [
        {
          "questionId": "q1",
          "correct": true,
          "userAnswer": 0,
          "correctAnswer": 0
        }
      ]
    }
  },
  "message": "Lesson completed successfully"
}
```

### PUT /api/lessons/:lessonId/complete

Mark lesson as completed.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Parameters:**
- `lessonId` - Lesson identifier

**Response:**
```json
{
  "success": true,
  "data": {
    "completion": {
      "lessonId": "lesson_1",
      "completedAt": "2024-01-20T16:00:00Z",
      "xpEarned": 10,
      "newTotalXP": 1260
    }
  },
  "message": "Lesson marked as completed"
}
```

## Progress Endpoints

### GET /api/progress/stats

Get user learning statistics.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalXP": 1260,
      "currentLevel": 13,
      "currentStreak": 6,
      "longestStreak": 12,
      "totalLessonsCompleted": 15,
      "totalTimeSpent": 450, // minutes
      "averageSessionTime": 30, // minutes
      "weeklyProgress": [
        { "day": "Monday", "xp": 50 },
        { "day": "Tuesday", "xp": 30 },
        { "day": "Wednesday", "xp": 40 }
      ]
    }
  }
}
```

## Health Check

### GET /api/health

Check API health status.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-20T16:30:00Z",
    "version": "1.0.0"
  },
  "message": "WordWanderer API is running!"
}
```

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 500 | Internal Server Error |

## Rate Limiting

API requests are rate limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute
- **Lesson submissions**: 10 requests per minute

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642694400
```
