```mermaid
erDiagram
    USER ||--o{ POST : creates
    USER ||--o{ FOLLOW : follows
    USER ||--o{ FOLLOW : followed_by
    USER ||--o{ LIKE : gives
    POST ||--o{ TASK : contains
    POST ||--o{ LIKE : receives

    USER {
        string id PK
        string custom_id UNIQUE
        string name
        string bio
        string image
        string email UNIQUE
    }

    POST {
        string id PK
        string user_id FK
        date targetDate
        text reflection
        datetime createdAt
        datetime updatedAt
    }

    TASK {
        string id PK
        string post_id FK
        string text
        boolean completed
    }

    FOLLOW {
        string id PK
        string follower_id FK
        string following_id FK
    }

    LIKE {
        string id PK
        string user_id FK
        string post_id FK
    }
```
なんかところどころgithubのer図がバグってるから注意

postsテーブルに対してtasksは何個でも作れるから一つに独立できる。
post_idにunique制約がないからできるこれが1対n
仮に１投稿１タスクにしたい場合　post_id uuid unique references posts(id)　のようにすると同じpost_idを使えないため
| id | post_id | text  |
| -- | ------- | ----- |
| 1  | A       | SQL勉強 |
| 2  | A       | ジム行く  |
| 3  | A       | 読書    |

のようにできなくなる
uniqeすげー💖
