# API Reference 📚

## `/api/summary`
- **Method**: POST
- **Description**: Generate summaries for dashboard cards.
- **Request Body**:
  ```json
  {
    "card": "github"
  }
  ```
- **Response**:
  ```json
  {
    "summary": "Top GitHub repositories..."
  }
  ```

## `/api/gadgets`
- **Method**: GET
- **Description**: Fetch gadget-related news articles.
